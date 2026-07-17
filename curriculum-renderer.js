const CurriculumRenderer = (() => {
  const ADMONITION_LABELS = { def: "定义", eg: "例", warn: "误区", tip: "方法", key: "要点", quote: "名言", compare: "辨析" };

  function escapeHtml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function createInlineRenderer({ documentId = "source", answers = {}, interactive = false } = {}) {
    let blankIndex = 0;
    return text => {
      const blanks = [];
      let html = escapeHtml(text);
      html = html.replace(/_{3,}/g, match => {
        blanks.push(match.length);
        return `\u0001${blanks.length - 1}\u0001`;
      });
      html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
      html = html.replace(/(^|[^A-Za-z0-9_])_([^_\n]+)_(?=[^A-Za-z0-9_]|$)/g, "$1<em>$2</em>");
      html = html.replace(/\u0001(\d+)\u0001/g, (match, rawIndex) => {
        const length = blanks[Number(rawIndex)];
        if (!interactive) {
          return length >= 24
            ? '<span class="source-blank source-blank-block"></span>'
            : `<span class="source-blank" style="width:${Math.min(Math.max(length * 0.42, 4), 30).toFixed(1)}em"></span>`;
        }
        const field = `${documentId}-${blankIndex}`;
        blankIndex += 1;
        const value = answers[field] || "";
        if (length >= 24) {
          return `<textarea class="source-answer-line source-answer-block" rows="1" data-source-answer="${escapeAttribute(field)}" aria-label="作答横线">${escapeHtml(value)}</textarea>`;
        }
        const width = Math.min(Math.max(length * 0.42, 4), 30).toFixed(1);
        return `<input class="source-answer-line source-answer-inline" style="width:${width}em" data-source-answer="${escapeAttribute(field)}" aria-label="填空作答" autocomplete="off" value="${escapeAttribute(value)}" />`;
      });
      return html;
    };
  }

  function renderTable(rows, inline) {
    if (rows.length < 2) return rows.map(row => `<p>${inline(row)}</p>`).join("");
    const cells = row => row.slice(1, -1).split("|").map(cell => cell.trim());
    const header = cells(rows[0]);
    const bodyRows = rows.slice(2);
    return `<div class="source-table-wrap"><table><thead><tr>${header.map(cell => `<th>${inline(cell)}</th>`).join("")}</tr></thead><tbody>${bodyRows.map(row => `<tr>${cells(row).map(cell => `<td>${inline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }

  function renderQuote(lines, inline, workbook = false) {
    const joined = lines.join("\n");
    const paragraphs = [];
    let current = [];
    for (const line of lines) {
      if (!line.trim()) {
        if (current.length) paragraphs.push(current.join(" "));
        current = [];
      } else current.push(line);
    }
    if (current.length) paragraphs.push(current.join(" "));
    let className = "source-quote";
    if (workbook && /(建议用时|作答规则|核心主张)/.test(joined)) className += " source-meta";
    if (workbook && joined.includes("材料")) className += " source-material";
    return `<blockquote class="${className}">${paragraphs.map(paragraph => `<p>${inline(paragraph)}</p>`).join("")}</blockquote>`;
  }

  function renderInner(lines, inline) {
    return lines.map(line => {
      const text = line.trim();
      if (!text) return "";
      if (/^[-*]\s/.test(text)) return `<div class="source-list-item"><span>•</span><div>${inline(text.replace(/^[-*]\s/, ""))}</div></div>`;
      const numbered = text.match(/^(\d+)\.\s+(.*)$/);
      if (numbered) return `<div class="source-list-item source-numbered"><span>${numbered[1]}.</span><div>${inline(numbered[2])}</div></div>`;
      return `<p>${inline(text)}</p>`;
    }).join("");
  }

  function renderMarkdown(markdown, options = {}) {
    const workbook = options.kind === "workbook";
    const inline = createInlineRenderer({ documentId: options.documentId, answers: options.answers, interactive: workbook && options.interactive !== false });
    const lines = markdown.replace(/\r/g, "").split("\n");
    let html = "";
    let table = [];
    let quote = [];
    let code = [];
    let inCode = false;
    let answerKeyOpen = false;
    let lastWasRule = false;

    const closeAnswerKey = () => {
      if (!answerKeyOpen) return;
      html += "</div></details>";
      answerKeyOpen = false;
    };
    const flushTable = () => {
      if (!table.length) return;
      html += renderTable(table, inline);
      table = [];
    };
    const flushQuote = () => {
      if (!quote.length) return;
      html += renderQuote(quote, inline, workbook);
      quote = [];
    };

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const text = line.trim();

      if (text.startsWith("```")) {
        if (inCode) {
          html += `<pre>${escapeHtml(code.join("\n"))}</pre>`;
          code = [];
          inCode = false;
        } else {
          flushTable();
          flushQuote();
          inCode = true;
        }
        continue;
      }
      if (inCode) {
        code.push(line);
        continue;
      }

      if (!workbook) {
        const admonition = text.match(/^:::\s*(\w+)\s*(.*)$/);
        if (admonition && ADMONITION_LABELS[admonition[1]]) {
          flushTable();
          flushQuote();
          const inner = [];
          index += 1;
          while (index < lines.length && lines[index].trim() !== ":::") {
            inner.push(lines[index]);
            index += 1;
          }
          const type = admonition[1];
          const title = admonition[2].trim();
          html += `<aside class="source-admonition source-admonition-${type}"><div class="source-admonition-head"><span>${ADMONITION_LABELS[type]}</span>${title ? `<strong>${inline(title)}</strong>` : ""}</div><div>${renderInner(inner, inline)}</div></aside>`;
          continue;
        }
      }

      if (text.startsWith("|") && text.endsWith("|")) {
        flushQuote();
        table.push(text);
        continue;
      }
      flushTable();
      if (text.startsWith(">")) {
        quote.push(line.replace(/^\s*>\s?/, ""));
        continue;
      }
      flushQuote();

      if (!text) {
        lastWasRule = false;
        continue;
      }
      if (/^---+$/.test(text) || /^\*\*\*+$/.test(text)) {
        if (!lastWasRule) html += "<hr>";
        lastWasRule = true;
        continue;
      }
      lastWasRule = false;

      const heading = text.match(/^(#{1,6})\s+(.*)$/);
      if (heading) {
        const level = heading[1].length;
        const title = heading[2];
        if (workbook && level === 2) closeAnswerKey();
        if (workbook && level === 2 && title.includes("参考与自评")) {
          html += `<details class="source-answer-key"><summary>${inline(title)}<span>完成后展开</span></summary><div class="source-answer-key-body">`;
          answerKeyOpen = true;
        } else if (workbook && level === 1) {
          const volumeTitle = title.match(/^卷([一二三四五六七八九十]+)\s*·\s*(.*)$/);
          html += volumeTitle
            ? `<h1 class="source-volume-title"><span>卷${volumeTitle[1]}</span>${inline(volumeTitle[2])}</h1>`
            : `<h1 class="source-volume-title">${inline(title)}</h1>`;
        } else if (level <= 2) html += `<h2>${inline(title)}</h2>`;
        else if (level === 3) html += `<h3>${inline(title)}</h3>`;
        else html += `<h4>${inline(title)}</h4>`;
        continue;
      }

      if (workbook && /^-\s\[\s?\]\s/.test(text)) {
        html += `<div class="source-check"><span></span><div>${inline(text.replace(/^-\s\[\s?\]\s/, ""))}</div></div>`;
        continue;
      }
      if (/^[-*]\s/.test(text)) {
        html += `<div class="source-list-item"><span>•</span><div>${inline(text.replace(/^[-*]\s/, ""))}</div></div>`;
        continue;
      }
      const numbered = text.match(/^(\d+)\.\s+(.*)$/);
      if (numbered) {
        html += workbook
          ? `<p class="source-question"><strong>${numbered[1]}.</strong> ${inline(numbered[2])}</p>`
          : `<div class="source-list-item source-numbered"><span>${numbered[1]}.</span><div>${inline(numbered[2])}</div></div>`;
        continue;
      }
      html += `<p>${inline(text)}</p>`;
    }
    flushTable();
    flushQuote();
    if (inCode) html += `<pre>${escapeHtml(code.join("\n"))}</pre>`;
    closeAnswerKey();
    return html;
  }

  return {
    renderHandbook(markdown) {
      return renderMarkdown(markdown, { kind: "handbook", interactive: false });
    },
    renderWorkbook(markdown, documentId, answers) {
      return renderMarkdown(markdown, { kind: "workbook", documentId, answers, interactive: true });
    }
  };
})();
