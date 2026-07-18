import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const output = new URL("../data/sources/ielts-official-spec.json", import.meta.url);
const retrievedAt = new Date().toISOString();
const USER_AGENT = "Mozilla/5.0 (compatible; ZhixingStudyAtelier/1.0; +https://github.com/machenyu2023/zhixing-study-atelier-pages)";

const pages = [
  {
    id: "academic-overview",
    url: "https://ielts.org/take-a-test/test-types/ielts-academic-test",
    expected: ["IELTS Academic", "Listening", "Reading", "Writing", "Speaking"],
    facts: { sections: ["Listening", "Reading", "Writing", "Speaking"] }
  },
  {
    id: "academic-reading-format",
    url: "https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-reading",
    expected: ["Time allowed: 60 minutes", "Number of sections: 3", "Number of questions: 40", "Multiple choice", "Matching headings", "Sentence completion"],
    facts: {
      durationMinutes: 60,
      sections: 3,
      questions: 40,
      totalTextLength: "2150-2750 words",
      taskTypes: ["Multiple choice", "Identifying information", "Identifying writer's views or claims", "Matching information", "Matching headings", "Matching features", "Matching sentence endings", "Sentence completion", "Summary completion", "Note completion", "Table completion", "Flow-chart completion", "Diagram label completion", "Short-answer questions"]
    }
  },
  {
    id: "academic-listening-format",
    url: "https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-listening",
    expected: ["Approximately 30 minutes", "Number of parts: 4", "Number of questions: 40", "Multiple choice", "Sentence completion", "summary completion"],
    facts: {
      durationMinutesApproximate: 30,
      parts: 4,
      questions: 40,
      recordingPlays: 1,
      taskTypes: ["Multiple choice", "Matching", "Plan, map or diagram labelling", "Form completion", "Note completion", "Table completion", "Flow-chart completion", "Summary completion", "Sentence completion", "Short-answer questions"]
    }
  },
  {
    id: "academic-writing-format",
    url: "https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-writing",
    expected: ["Time allowed: 60 minutes", "Number of tasks: 2", "Task 2 contributes twice as much", "at least 150 words", "at least 250 words"],
    facts: {
      durationMinutes: 60,
      tasks: 2,
      task1MinimumWords: 150,
      task1SuggestedMinutes: 20,
      task2MinimumWords: 250,
      task2SuggestedMinutes: 40,
      task2WeightRelativeToTask1: 2
    }
  },
  {
    id: "academic-sample-index",
    url: "https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test",
    expected: ["Academic Reading sample", "three texts", "40 questions", "books, journals, magazines and newspapers", "Academic Writing sample"],
    facts: {
      readingSourceTypes: ["books", "journals", "magazines", "newspapers"],
      samplePurpose: "Demonstrates official task formats; official question text is not copied into this project."
    }
  }
];

function normalizeText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&ndash;|&#8211;/gi, "-")
    .replace(/&mdash;|&#8212;/gi, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1] || "";
}

function metadata(html) {
  const title = normalizeText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  const descriptionTag = metaTags.find(tag => attribute(tag, "name").toLowerCase() === "description");
  return { title, description: attribute(descriptionTag || "", "content") };
}

async function fetchWithCurl(url) {
  const { stdout } = await execFileAsync("curl", [
    "--fail", "--silent", "--show-error", "--location", "--max-time", "60",
    "--user-agent", USER_AGENT, "--header", "Accept: text/html,application/xhtml+xml", url
  ], { encoding: "utf8", maxBuffer: 5 * 1024 * 1024 });
  return stdout;
}

async function fetchHtml(url) {
  try {
    const response = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml" } });
    if (response.ok) return response.text();
  } catch {
    // curl uses the operating system's network stack and is the fallback on restricted Windows hosts.
  }
  return fetchWithCurl(url);
}

const synchronizedPages = [];
for (const page of pages) {
  const html = await fetchHtml(page.url);
  if (html.length < 20_000) throw new Error(`Official IELTS page is unexpectedly short: ${page.url}`);
  const text = normalizeText(html).toLowerCase();
  const missing = page.expected.filter(phrase => !text.includes(phrase.toLowerCase()));
  if (missing.length) throw new Error(`Official IELTS page is missing expected format facts (${missing.join(", ")}): ${page.url}`);
  const pageMetadata = metadata(html);
  synchronizedPages.push({
    id: page.id,
    url: page.url,
    title: pageMetadata.title,
    description: pageMetadata.description,
    contentSha256: createHash("sha256").update(html).digest("hex"),
    facts: page.facts
  });
  await new Promise(resolve => setTimeout(resolve, 250));
}

const snapshot = {
  schemaVersion: 1,
  retrievedAt,
  authority: "IELTS official website",
  policy: {
    use: "Exam structure and task-format reference only",
    officialQuestionTextStored: false,
    officialQuestionTextCopied: false,
    generatedQuestionsLanguage: "English",
    generatedQuestionsOwnership: "Project original",
    trademarkAffiliationClaimed: false
  },
  pages: synchronizedPages
};

await mkdir(new URL("./", output), { recursive: true });
await writeFile(output, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Saved ${synchronizedPages.length} official IELTS specification records to ${output.pathname}.`);
