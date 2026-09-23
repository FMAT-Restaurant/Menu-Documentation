#!/usr/bin/env node

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

// Mermaid's parser is distributed with browser-oriented sanitization. Create
// the smallest DOM it needs before loading Mermaid so parse() exercises the
// official parser instead of failing on an absent browser runtime.
const dom = new JSDOM("<!doctype html><html><body></body></html>");
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.DOMParser = dom.window.DOMParser;
globalThis.Element = dom.window.Element;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.SVGElement = dom.window.SVGElement;
globalThis.Node = dom.window.Node;

const { default: mermaid } = await import("mermaid");

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const sourceExtensions = new Set([".md", ".markdown", ".mdown", ".mmd"]);
const ignoredDirectories = new Set([
  ".git",
  "node_modules",
  ".pnpm-store",
  "coverage",
  "dist",
  "build",
]);

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "strict",
});

function displayPath(filePath) {
  return path.relative(repositoryRoot, filePath).replaceAll(path.sep, "/");
}

async function collectSourceFiles(rootPath) {
  const rootStats = await stat(rootPath);
  if (rootStats.isFile()) {
    return sourceExtensions.has(path.extname(rootPath).toLowerCase())
      ? [rootPath]
      : [];
  }

  const entries = await readdir(rootPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const entryPath = path.join(rootPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && sourceExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(entryPath);
    }
  }

  return files;
}

function extractMermaidBlocks(content) {
  const lines = content.split(/\r?\n/);
  const blocks = [];
  const errors = [];
  let index = 0;

  while (index < lines.length) {
    if (!/^\s*```mermaid\s*$/.test(lines[index])) {
      index += 1;
      continue;
    }

    const fenceLine = index + 1;
    const codeStartLine = fenceLine + 1;
    index += 1;
    const codeLines = [];
    let closed = false;

    while (index < lines.length) {
      if (/^\s*```\s*$/.test(lines[index])) {
        closed = true;
        break;
      }
      codeLines.push(lines[index]);
      index += 1;
    }

    if (!closed) {
      errors.push({
        line: fenceLine,
        message: "Unclosed Mermaid code fence.",
      });
      break;
    }

    blocks.push({
      code: codeLines.join("\n"),
      codeStartLine,
    });
    index += 1;
  }

  return { blocks, errors };
}

function sourceLineForMermaidError(message, codeStartLine) {
  const match = message.match(/line\s+(\d+)/i);
  if (!match) {
    return codeStartLine;
  }
  return codeStartLine + Number.parseInt(match[1], 10) - 1;
}

async function validateFile(filePath) {
  const content = await readFile(filePath, "utf8");
  const { blocks, errors } = extractMermaidBlocks(content);
  const diagnostics = errors.map((error) => ({
    filePath,
    line: error.line,
    message: error.message,
  }));

  for (const [index, block] of blocks.entries()) {
    try {
      await mermaid.parse(block.code);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      diagnostics.push({
        filePath,
        line: sourceLineForMermaidError(message, block.codeStartLine),
        block: index + 1,
        message: message.replaceAll(/\s+/g, " ").trim(),
      });
    }
  }

  return { filePath, blockCount: blocks.length, diagnostics };
}

async function resolveRequestedRoots() {
  const requested = process.argv.slice(2).filter((argument) => argument !== "--");
  if (requested.length === 0) {
    return [repositoryRoot];
  }

  return requested.map((requestedPath) =>
    path.resolve(process.cwd(), requestedPath)
  );
}

const roots = await resolveRequestedRoots();
const sourceFiles = [];

for (const root of roots) {
  sourceFiles.push(...(await collectSourceFiles(root)));
}

const uniqueFiles = [...new Set(sourceFiles)].sort();
const results = [];

for (const filePath of uniqueFiles) {
  results.push(await validateFile(filePath));
}

const diagnostics = results.flatMap((result) => result.diagnostics);
const blockCount = results.reduce((total, result) => total + result.blockCount, 0);
const diagramFileCount = results.filter((result) => result.blockCount > 0).length;

for (const diagnostic of diagnostics) {
  const blockSuffix = diagnostic.block ? ` (block ${diagnostic.block})` : "";
  console.error(
    `FAIL ${displayPath(diagnostic.filePath)}:${diagnostic.line}${blockSuffix}\n  ${diagnostic.message}`
  );
}

if (diagnostics.length > 0) {
  console.error(
    `Mermaid validation failed: ${diagnostics.length} diagnostic(s) in ${blockCount} block(s).`
  );
  process.exitCode = 1;
} else {
  console.log(
    `Mermaid validation passed: ${blockCount} block(s) across ${diagramFileCount} source file(s); scanned ${uniqueFiles.length}.`
  );
}
