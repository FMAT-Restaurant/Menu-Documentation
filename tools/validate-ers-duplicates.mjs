#!/usr/bin/env node

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const sourceRoots = [
  path.join(repositoryRoot, "docs", "ers"),
  path.join(repositoryRoot, "docs", "other", "md", "domain-model.md"),
];

function displayPath(filePath) {
  return path.relative(repositoryRoot, filePath).replaceAll(path.sep, "/");
}

async function collectMarkdownFiles(rootPath) {
  const rootStats = await stat(rootPath);
  if (rootStats.isFile()) {
    return path.extname(rootPath).toLowerCase() === ".md" ? [rootPath] : [];
  }

  const entries = await readdir(rootPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(rootPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(entryPath)));
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".md") {
      files.push(entryPath);
    }
  }

  return files;
}

function normalizeText(value) {
  return value.trim().replaceAll(/\s+/g, " ");
}

function isRelevantMarkdownBlock(value) {
  return (
    value.length >= 80 ||
    /^[-*+]\s+\*\*(?:Requisito|Criterio de aceptación):\*\*/i.test(value)
  );
}

function validateMermaidBlock(lines, startLine, filePath, diagnostics, seenDiagrams) {
  const meaningfulLines = lines
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("%%"));
  const diagramKey = meaningfulLines.join("\n");
  const firstDiagramLine = seenDiagrams.get(diagramKey);

  if (firstDiagramLine !== undefined) {
    diagnostics.push({
      filePath,
      line: startLine,
      message: `duplicated Mermaid diagram (first declared at line ${firstDiagramLine})`,
    });
  } else {
    seenDiagrams.set(diagramKey, startLine);
  }

  const seenDeclarations = new Map();
  const seenClasses = new Map();
  const seenMembers = new Map();
  let currentClass = "";
  for (let offset = 0; offset < lines.length; offset += 1) {
    const declaration = normalizeText(lines[offset]);
    if (!declaration || declaration.startsWith("%%") || declaration === "}") {
      if (declaration === "}") {
        currentClass = "";
      }
      continue;
    }

    const classMatch = declaration.match(/^class\s+([\w-]+)\s*\{/i);
    if (classMatch) {
      const className = classMatch[1];
      const firstLine = seenClasses.get(className);
      if (firstLine !== undefined) {
        diagnostics.push({
          filePath,
          line: startLine + offset,
          message: `duplicated Mermaid class declaration (first appears at line ${firstLine})`,
        });
      } else {
        seenClasses.set(className, startLine + offset);
      }
      currentClass = className;
      continue;
    }

    if (currentClass && /^(?:[+#~-][\w]+|<<[^>]+>>)$/.test(declaration)) {
      const memberKey = `${currentClass}\u0000${declaration}`;
      const firstLine = seenMembers.get(memberKey);
      if (firstLine !== undefined) {
        diagnostics.push({
          filePath,
          line: startLine + offset,
          message: `duplicated Mermaid class member (first appears at line ${firstLine})`,
        });
      } else {
        seenMembers.set(memberKey, startLine + offset);
      }
      continue;
    }

    const isDuplicateDeclaration =
      /(?:<\|--|\*--|o--|--o|--\*|-->|\.\.>|==>|---|->)/.test(declaration) ||
      /^[\w-]+\s*\[[^\]]+\]$/.test(declaration) ||
      /^[\w-]+\s*\{[^}]+\}$/.test(declaration);
    if (!isDuplicateDeclaration) {
      continue;
    }

    const firstLine = seenDeclarations.get(declaration);
    if (firstLine !== undefined) {
      diagnostics.push({
        filePath,
        line: startLine + offset,
        message: `duplicated Mermaid declaration (first appears at line ${firstLine})`,
      });
    } else {
      seenDeclarations.set(declaration, startLine + offset);
    }
  }
}

async function validateFile(filePath) {
  const content = await readFile(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const diagnostics = [];
  const seenHeadings = new Map();
  let seenMarkdownBlocks = new Map();
  let seenMarkdownLines = new Map();
  const seenDiagrams = new Map();
  let paragraphLines = [];
  let paragraphStart = 0;
  let insideFence = false;
  let fenceMarker = "";
  let fenceLines = [];
  let fenceStart = 0;
  let isMermaidFence = false;

  function recordMarkdownBlock(blockLines, lineNumber) {
    const block = normalizeText(blockLines.join(" "));
    if (!isRelevantMarkdownBlock(block)) {
      return;
    }

    const firstLine = seenMarkdownBlocks.get(block);
    if (firstLine !== undefined) {
      diagnostics.push({
        filePath,
        line: lineNumber,
        message: `duplicated Markdown content (first appears at line ${firstLine})`,
      });
    } else {
      seenMarkdownBlocks.set(block, lineNumber);
    }
  }

  function flushParagraph() {
    if (paragraphLines.length > 0) {
      recordMarkdownBlock(paragraphLines, paragraphStart);
      paragraphLines = [];
    }
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})(.*)$/);

    if (insideFence) {
      if (
        fenceMatch &&
        fenceMatch[1][0] === fenceMarker[0] &&
        fenceMatch[1].length >= fenceMarker.length &&
        fenceMatch[2].trim() === ""
      ) {
        if (isMermaidFence) {
          validateMermaidBlock(
            fenceLines,
            fenceStart + 1,
            filePath,
            diagnostics,
            seenDiagrams,
          );
        }
        insideFence = false;
        fenceLines = [];
        isMermaidFence = false;
      } else if (fenceMatch) {
        diagnostics.push({
          filePath,
          line: index + 1,
          message: "nested code fence opener within an open code block",
        });
        if (isMermaidFence) {
          fenceLines.push(line);
        }
      } else if (isMermaidFence) {
        fenceLines.push(line);
      }
      continue;
    }

    if (fenceMatch) {
      flushParagraph();
      insideFence = true;
      fenceMarker = fenceMatch[1];
      fenceStart = index;
      isMermaidFence = /^\s*mermaid\b/i.test(fenceMatch[2]);
      fenceLines = [];
      continue;
    }

    const headingMatch = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (headingMatch) {
      flushParagraph();
      const heading = normalizeText(headingMatch[2]).toLocaleLowerCase("es");
      const firstLine = seenHeadings.get(heading);
      if (firstLine !== undefined) {
        diagnostics.push({
          filePath,
          line: index + 1,
          message: `duplicated Markdown heading (first appears at line ${firstLine})`,
        });
      } else {
        seenHeadings.set(heading, index + 1);
      }
      if (headingMatch[1].length <= 2) {
        seenMarkdownBlocks = new Map();
        seenMarkdownLines = new Map();
      }
      continue;
    }

    const trimmed = line.trim();
    if (trimmed.length === 0) {
      flushParagraph();
      continue;
    }

    if (/^(?:[-*_]\s*){3,}$/.test(trimmed) || /^\|\s*:?-{3,}/.test(trimmed)) {
      flushParagraph();
      continue;
    }

    const normalizedLine = normalizeText(trimmed);
    const isListLine = /^(?:[-*+]\s+|\d+[.)]\s+|\|)/.test(trimmed);
    if (!isListLine && isRelevantMarkdownBlock(normalizedLine)) {
      const firstLine = seenMarkdownLines.get(normalizedLine);
      if (firstLine !== undefined) {
        diagnostics.push({
          filePath,
          line: index + 1,
          message: `duplicated Markdown line (first appears at line ${firstLine})`,
        });
      } else {
        seenMarkdownLines.set(normalizedLine, index + 1);
      }
    }

    if (/^(?:[-*+]\s+|\d+[.)]\s+|\|)/.test(trimmed)) {
      flushParagraph();
      recordMarkdownBlock([trimmed], index + 1);
      continue;
    }

    if (paragraphLines.length === 0) {
      paragraphStart = index + 1;
    }
    paragraphLines.push(trimmed);
  }

  flushParagraph();
  if (insideFence) {
    diagnostics.push({
      filePath,
      line: fenceStart + 1,
      message: "unclosed code fence",
    });
  }
  return diagnostics;
}

const files = [];
for (const rootPath of sourceRoots) {
  files.push(...(await collectMarkdownFiles(rootPath)));
}

const uniqueFiles = [...new Set(files)].sort();
const diagnostics = [];
for (const filePath of uniqueFiles) {
  diagnostics.push(...(await validateFile(filePath)));
}

for (const diagnostic of diagnostics) {
  console.error(
    `FAIL ${displayPath(diagnostic.filePath)}:${diagnostic.line}\n  ${diagnostic.message}`,
  );
}

if (diagnostics.length > 0) {
  console.error(`ERS duplicate validation failed: ${diagnostics.length} duplicate(s).`);
  process.exitCode = 1;
} else {
  console.log(
    `ERS duplicate validation passed: ${uniqueFiles.length} Markdown source file(s) scanned.`,
  );
}
