import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = Number(process.env.PORT || 4173);
const MODEL = process.env.OPENAI_GRADING_MODEL || "gpt-5.6-luna";
const REASONING_EFFORT = process.env.OPENAI_REASONING_EFFORT || "low";
const MAX_BODY_BYTES = 100_000;

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg"
};

const dimensionSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "integer", minimum: 0, maximum: 4 },
    feedback: { type: "string" }
  },
  required: ["score", "feedback"]
};

const gradingSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dimensions: {
      type: "object",
      additionalProperties: false,
      properties: {
        concept_clarity: dimensionSchema,
        argument_structure: dimensionSchema,
        evidence_awareness: dimensionSchema,
        counterargument: dimensionSchema,
        expression_quality: dimensionSchema
      },
      required: ["concept_clarity", "argument_structure", "evidence_awareness", "counterargument", "expression_quality"]
    },
    total: { type: "integer", minimum: 0, maximum: 20 },
    strengths: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 3 },
    priority_issue: { type: "string" },
    coaching_question: { type: "string" },
    revision_suggestion: { type: "string" }
  },
  required: ["dimensions", "total", "strengths", "priority_issue", "coaching_question", "revision_suggestion"]
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error("Request body is too large");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function extractOutputText(payload) {
  for (const output of payload.output || []) {
    if (output.type !== "message") continue;
    for (const item of output.content || []) {
      if (item.type === "refusal") throw new Error(item.refusal || "The grading request was refused");
      if (item.type === "output_text" && item.text) return item.text;
    }
  }
  throw new Error("The model returned no grading result");
}

function normalizeGrade(grade) {
  const scores = Object.values(grade.dimensions).map(item => Number(item.score));
  grade.total = scores.reduce((sum, score) => sum + score, 0);
  return grade;
}

async function gradeAnswer(request, response) {
  if (!process.env.OPENAI_API_KEY) {
    sendJson(response, 503, { error: "AI grading is not configured", code: "AI_NOT_CONFIGURED" });
    return;
  }
  let body;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    sendJson(response, 400, { error: error.message, code: "INVALID_REQUEST" });
    return;
  }
  if (!body?.question?.prompt || typeof body.answer !== "string" || body.answer.trim().length < 20) {
    sendJson(response, 400, { error: "A question and a substantive answer are required", code: "INVALID_REQUEST" });
    return;
  }

  const gradingInput = {
    question: body.question.prompt,
    reading_passage: body.question.passage || null,
    expected_checkpoints: body.question.checkpoints || [],
    student_answer: body.answer
  };

  const apiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      store: false,
      reasoning: { effort: REASONING_EFFORT },
      instructions: "You are a rigorous Chinese logic and writing coach. Grade only the reasoning and expression visible in the answer. Do not reward length by itself. Give concrete evidence for each score. Do not provide a full standard answer. Use the five dimensions exactly, each scored from 0 to 4.",
      input: JSON.stringify(gradingInput),
      text: {
        format: {
          type: "json_schema",
          name: "zhixing_grading_result",
          strict: true,
          schema: gradingSchema
        }
      },
      max_output_tokens: 1400
    })
  });

  const payload = await apiResponse.json();
  if (!apiResponse.ok) {
    sendJson(response, apiResponse.status, { error: payload.error?.message || "OpenAI grading failed", code: "OPENAI_ERROR" });
    return;
  }
  try {
    const grade = normalizeGrade(JSON.parse(extractOutputText(payload)));
    sendJson(response, 200, { grade, model: MODEL, gradedAt: new Date().toISOString() });
  } catch (error) {
    sendJson(response, 502, { error: error.message, code: "INVALID_MODEL_OUTPUT" });
  }
}

async function serveStatic(request, response) {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const safeRelative = normalize(relative).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = join(ROOT, safeRelative);
  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("Not a file");
    const content = await readFile(filePath);
    response.writeHead(200, { "content-type": CONTENT_TYPES[extname(filePath)] || "application/octet-stream" });
    response.end(content);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

const server = createServer(async (request, response) => {
  try {
    if (request.method === "GET" && request.url === "/api/health") {
      sendJson(response, 200, { ok: true, aiConfigured: Boolean(process.env.OPENAI_API_KEY), model: MODEL });
      return;
    }
    if (request.method === "POST" && request.url === "/api/grade") {
      await gradeAnswer(request, response);
      return;
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405).end("Method not allowed");
      return;
    }
    await serveStatic(request, response);
  } catch (error) {
    sendJson(response, 500, { error: error.message, code: "SERVER_ERROR" });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Zhixing is running at http://127.0.0.1:${PORT}`);
  console.log(`AI grading: ${process.env.OPENAI_API_KEY ? `enabled (${MODEL})` : "disabled"}`);
});
