import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDocsRoot = path.join(repositoryRoot, 'docs');
const stagingRoot = path.join(os.tmpdir(), 'fmat-menu-documentation-site');
const expectedStagingRoot = path.resolve(path.join(os.tmpdir(), 'fmat-menu-documentation-site'));
const stagedDocsRoot = path.join(stagingRoot, 'docs');
const stagedStaticRoot = path.join(stagingRoot, 'static');

const sourceFolders = new Map([
  ['ers', 'specification'],
  ['product', 'product'],
  ['other', 'reference'],
  ['contracts', 'contracts'],
]);

const ersSidebarPositions = new Map([
  ['ers/README.md', 1],
  ['ers/configuration.md', 2],
  ['ers/context.md', 3],
  ['ers/architechture.md', 4],
  ['ers/functional-requirements.md', 5],
  ['ers/non-functional-requirements.md', 6],
  ['ers/business-rules.md', 7],
  ['ers/open.md', 8],
  ['ers/traceability.md', 9],
]);

const renderedOtherMarkdown = new Set([
  'other/stack.md',
  'other/how-to-create-technical-documents-from-prds.md',
  'other/md/domain-model.md',
]);

const archivedOtherMarkdown = new Set([
  'other/md/Problema-Inicial.md',
  'other/md/Consultoria-1.md',
  'other/md/Consultoria-2.md',
  'other/md/Auditoria-1.md',
  'other/md/Auditoria-2.md',
  'other/md/Modelo-Pre-Final.md',
  'other/md/Decisiones-cierre-invariantes.md',
  'other/md/Req-F-Aproved.md',
  'other/md/Auditoria-3.md',
  'other/md/Auditoria-4.md',
  'other/md/Consultoria-3.md',
  'other/templates/template-technical-implementation-plan.md',
]);

if (path.resolve(stagingRoot) !== expectedStagingRoot || path.resolve(stagingRoot) === repositoryRoot) {
  throw new Error(`Refusing to replace unexpected staging directory: ${stagingRoot}`);
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function mergeFrontmatter(content, values) {
  const bom = content.startsWith('\uFEFF') ? '\uFEFF' : '';
  const source = bom ? content.slice(1) : content;
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  const match = /^(---[ \t]*\r?\n)([\s\S]*?)(\r?\n---[ \t]*)(\r?\n)?/.exec(source);
  const lines = match ? match[2].split(/\r?\n/) : [];

  for (const [key, value] of Object.entries(values)) {
    const keyPattern = new RegExp(`^${key}\\s*:`);
    const existingIndexes = lines.flatMap((line, index) => keyPattern.test(line) ? [index] : []);
    const serializedValue = typeof value === 'number' ? String(value) : JSON.stringify(value);

    if (existingIndexes.length) {
      lines[existingIndexes[0]] = `${key}: ${serializedValue}`;
      for (const duplicateIndex of existingIndexes.slice(1).reverse()) lines.splice(duplicateIndex, 1);
    } else {
      lines.push(`${key}: ${serializedValue}`);
    }
  }

  if (!match) return `${bom}---${newline}${lines.join(newline)}${newline}---${newline}${newline}${source}`;

  const body = source.slice(match[0].length);
  return `${bom}${match[1]}${lines.join(newline)}${match[3]}${match[4] ?? newline}${body}`;
}

function stagedDocumentPath(sourceRelativePath) {
  const parts = toPosix(sourceRelativePath).split('/');
  const destinationFolder = sourceFolders.get(parts[0]);
  if (!destinationFolder) return null;

  const remaining = parts.slice(1);
  if (remaining.at(-1)?.toLowerCase() === 'readme.md') remaining[remaining.length - 1] = 'index.md';
  return path.posix.join(destinationFolder, ...remaining);
}

function markdownPublicationTarget(sourceRelativePath) {
  const normalizedPath = toPosix(sourceRelativePath);
  if (normalizedPath.startsWith('other/')) {
    if (renderedOtherMarkdown.has(normalizedPath)) {
      const stagedPath = stagedDocumentPath(sourceRelativePath);
      return stagedPath ? { type: 'document', path: stagedPath } : null;
    }

    if (archivedOtherMarkdown.has(normalizedPath)) {
      const archivePath = path.posix.join('reference', 'source', `${normalizedPath.slice('other/'.length)}.txt`);
      return { type: 'static', route: `/${archivePath}` };
    }

    return null;
  }

  const stagedPath = stagedDocumentPath(sourceRelativePath);
  return stagedPath ? { type: 'document', path: stagedPath } : null;
}

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolutePath));
    else if (entry.isFile()) files.push(absolutePath);
  }
  return files;
}

function findMarkdownTarget(absolutePath) {
  const exists = fs.existsSync(absolutePath);
  const isDirectory = exists && fs.statSync(absolutePath).isDirectory();
  const candidates = isDirectory
    ? [path.join(absolutePath, 'README.md'), path.join(absolutePath, 'index.md')]
    : path.extname(absolutePath)
      ? [absolutePath]
      : [absolutePath, `${absolutePath}.md`];

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    const stat = fs.statSync(candidate);
    if (stat.isDirectory()) continue;
    if (path.extname(candidate).toLowerCase() === '.md') return candidate;
  }
  return null;
}

function documentRoute(stagedRelativePath) {
  const parsed = path.posix.parse(stagedRelativePath);
  const directory = parsed.name === 'index' ? parsed.dir : path.posix.join(parsed.dir, parsed.name);
  return `/${directory ? `${directory}/` : ''}`;
}

function relativeDocumentLink(fromStagedPath, toStagedPath) {
  const relativeLink = path.posix.relative(path.posix.dirname(fromStagedPath), toStagedPath);
  return relativeLink || path.posix.basename(toStagedPath);
}

function relativeStaticLink(staticRoute) {
  return staticRoute;
}

function markdownLink(label, destination) {
  const escapedLabel = label.replaceAll('\\', '\\\\').replaceAll('[', '\\[').replaceAll(']', '\\]');
  const encodedDestination = destination.split('/').map((part) => encodeURIComponent(part)).join('/');
  return `[${escapedLabel}](${encodedDestination})`;
}

function staticRouteForSourceFile(sourceRelativePath) {
  const relativePath = toPosix(sourceRelativePath);
  if (relativePath.startsWith('contracts/') || relativePath.startsWith('assets/')) {
    return `/${relativePath}`;
  }
  return null;
}

function compareDirectoryEntries(left, right) {
  const leftName = left.name.toLowerCase();
  const rightName = right.name.toLowerCase();
  if (leftName < rightName) return -1;
  if (leftName > rightName) return 1;
  if (left.name < right.name) return -1;
  if (left.name > right.name) return 1;
  return 0;
}

function ensureDirectoryIndex(sourceDirectory) {
  const existingIndex = findMarkdownTarget(sourceDirectory);
  if (existingIndex) return existingIndex;

  const sourceDirectoryRelative = toPosix(path.relative(sourceDocsRoot, sourceDirectory));
  if (sourceDirectoryRelative === 'other' || sourceDirectoryRelative.startsWith('other/')) return null;

  const sourceIndex = path.join(sourceDirectory, 'index.md');
  const sourceIndexRelative = path.relative(sourceDocsRoot, sourceIndex);
  const stagedIndex = stagedDocumentPath(sourceIndexRelative);
  if (!stagedIndex) return null;

  const entries = fs.readdirSync(sourceDirectory, { withFileTypes: true }).sort(compareDirectoryEntries);
  const title = path.basename(sourceDirectory);
  const lines = [`# ${title}`, '', '## Contenido', ''];

  for (const entry of entries) {
    const sourceEntry = path.join(sourceDirectory, entry.name);
    const sourceEntryRelative = path.relative(sourceDocsRoot, sourceEntry);
    let destination = null;
    const label = entry.isDirectory() ? `${entry.name}/` : entry.name;

    if (entry.isDirectory()) {
      const childIndex = ensureDirectoryIndex(sourceEntry);
      if (childIndex) {
        const childPublication = markdownPublicationTarget(path.relative(sourceDocsRoot, childIndex));
        if (childPublication?.type === 'document') {
          destination = relativeDocumentLink(stagedIndex, childPublication.path);
        } else if (childPublication?.type === 'static') {
          destination = relativeStaticLink(childPublication.route);
        }
      }
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.md') {
      const childPublication = markdownPublicationTarget(sourceEntryRelative);
      if (childPublication?.type === 'document') {
        destination = relativeDocumentLink(stagedIndex, childPublication.path);
      } else if (childPublication?.type === 'static') {
        destination = relativeStaticLink(childPublication.route);
      }
    } else if (entry.isFile()) {
      const staticRoute = staticRouteForSourceFile(sourceEntryRelative);
      if (staticRoute) destination = relativeStaticLink(staticRoute);
    }

    lines.push(destination ? `- ${markdownLink(label, destination)}` : `- \`${label.replaceAll('`', '\\`')}\``);
  }

  if (entries.length === 0) lines.push('- (Sin archivos ni subdirectorios.)');

  const stagedIndexAbsolute = path.join(stagedDocsRoot, stagedIndex);
  fs.mkdirSync(path.dirname(stagedIndexAbsolute), { recursive: true });
  fs.writeFileSync(stagedIndexAbsolute, `${lines.join('\n')}\n`, 'utf8');
  return sourceIndex;
}

function resolveLocalDestination(sourceFile, sourceStagedPath, urlPath, sourceGroup) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(urlPath);
  } catch {
    decodedPath = urlPath;
  }

  const absoluteTarget = path.resolve(path.dirname(sourceFile), decodedPath);
  const sourceRelativeTarget = path.relative(sourceDocsRoot, absoluteTarget);
  if (sourceRelativeTarget === '..' || sourceRelativeTarget.startsWith(`..${path.sep}`) || path.isAbsolute(sourceRelativeTarget)) {
    return { unresolved: true, reason: 'resolves outside docs/' };
  }

  const markdownTarget = findMarkdownTarget(absoluteTarget);
  if (markdownTarget) {
    const markdownRelativePath = path.relative(sourceDocsRoot, markdownTarget);
    const publicationTarget = markdownPublicationTarget(markdownRelativePath);
    if (!publicationTarget) return { unresolved: true, reason: 'Markdown target is not included in the published documentation' };
    if (publicationTarget.type === 'static') {
      return { value: relativeStaticLink(publicationTarget.route) };
    }
    return { value: relativeDocumentLink(sourceStagedPath, publicationTarget.path) };
  }

  if (!fs.existsSync(absoluteTarget)) {
    return { unresolved: true, reason: 'target does not exist' };
  }

  const targetStat = fs.statSync(absoluteTarget);
  if (targetStat.isDirectory()) {
    const directoryIndex = ensureDirectoryIndex(absoluteTarget);
    if (!directoryIndex) return { unresolved: true, reason: 'directory has no published documentation index' };

    const indexRelativePath = path.relative(sourceDocsRoot, directoryIndex);
    const stagedIndex = stagedDocumentPath(indexRelativePath);
    if (!stagedIndex) return { unresolved: true, reason: 'directory index is outside the published documentation folders' };

    return { value: relativeDocumentLink(sourceStagedPath, stagedIndex) };
  }

  if (!targetStat.isFile()) {
    return { unresolved: true, reason: 'target is not a file or directory' };
  }

  const targetRelativePath = toPosix(sourceRelativeTarget);
  if (targetRelativePath.startsWith('assets/')) {
    const stagedAsset = path.posix.join('assets', targetRelativePath.slice('assets/'.length));
    const relativeLink = path.posix.relative(path.posix.dirname(sourceStagedPath), stagedAsset);
    return { value: relativeLink || path.posix.basename(stagedAsset) };
  }

  if (targetRelativePath.startsWith('contracts/')) {
    const staticRoute = `/${targetRelativePath}`;
    return { value: staticRoute };
  }

  if (sourceGroup === 'other') return { unresolved: true, reason: 'non-Markdown legacy asset is not staged' };
  return { unresolved: true, reason: 'target is not a published Markdown or contract asset' };
}

function rewriteDestination(sourceFile, sourceStagedPath, destination, sourceGroup, missingLinks) {
  const trimmed = destination.trim();
  const wrapped = trimmed.startsWith('<') && trimmed.includes('>');
  const end = wrapped ? trimmed.indexOf('>') + 1 : trimmed.search(/\s/);
  const tokenEnd = end < 0 ? trimmed.length : end;
  const rawUrl = trimmed.slice(0, tokenEnd);
  const leading = wrapped ? 1 : 0;
  const trailing = wrapped ? 1 : 0;
  const url = rawUrl.slice(leading, rawUrl.length - trailing || undefined);

  if (!url || url.startsWith('#') || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) return destination;

  const fragmentAt = url.indexOf('#');
  const queryAt = url.indexOf('?');
  const suffixAt = [fragmentAt, queryAt].filter((index) => index >= 0).sort((a, b) => a - b)[0];
  const urlPath = suffixAt === undefined ? url : url.slice(0, suffixAt);
  const suffix = suffixAt === undefined ? '' : url.slice(suffixAt);
  if (!urlPath) return destination;

  const resolved = resolveLocalDestination(sourceFile, sourceStagedPath, urlPath, sourceGroup);
  if (resolved.unresolved) {
    const relative = toPosix(path.relative(sourceDocsRoot, sourceFile));
    const detail = `${relative} -> ${urlPath} (${resolved.reason})`;
    missingLinks.push({ group: sourceGroup, detail });
    if (sourceGroup === 'ers' || sourceGroup === 'product' || sourceGroup === 'contracts') {
      throw new Error(`Unresolvable documentation link: ${detail}`);
    }
    return destination;
  }

  const rewrittenUrl = wrapped ? `<${resolved.value}${suffix}>` : `${resolved.value}${suffix}`;
  return `${rewrittenUrl}${trimmed.slice(tokenEnd)}`;
}

function rewriteMarkdown(markdown, sourceFile, sourceStagedPath, sourceGroup, missingLinks) {
  const inlinePattern = /(!?\[[^\]]*\]\()([^)]+)(\))/g;
  let result = markdown.replace(inlinePattern, (whole, prefix, destination, suffix) =>
    `${prefix}${rewriteDestination(sourceFile, sourceStagedPath, destination, sourceGroup, missingLinks)}${suffix}`,
  );

  const referenceDefinition = /^(\s{0,3}\[[^\]]+\]:\s*)(<[^>\n]+>|\S+)(.*)$/gm;
  result = result.replace(referenceDefinition, (whole, prefix, destination, suffix) =>
    `${prefix}${rewriteDestination(sourceFile, sourceStagedPath, destination, sourceGroup, missingLinks)}${suffix}`,
  );
  return result;
}

function transformRawRestPathsOutsideInlineCode(text) {
  const rawRestPathPattern = /(?<![A-Za-z0-9_./:-])\/[A-Za-z0-9._~!$&'*+,;=:@%{}-]+(?:\/[A-Za-z0-9._~!$&'*+,;=:@%{}-]+)*\/?/g;
  const bareRestResourcePaths = new Set(['/menus', '/entries', '/recipe-libraries']);
  return text.replace(rawRestPathPattern, (match) => {
    const trailingPunctuation = match.match(/[.,;:!?]+$/)?.[0] ?? '';
    const path = trailingPunctuation ? match.slice(0, -trailingPunctuation.length) : match;
    const normalizedPath = path.replace(/\/+$/, '') || '/';
    const hasPathParameter = /(?:^|\/)\{[^/{}\s]+\}(?:\/|$)/.test(path);
    if (!hasPathParameter && !bareRestResourcePaths.has(normalizedPath)) return match;
    return `\`${path}\`${trailingPunctuation}`;
  });
}

function findInlineCodeClosingRun(line, searchFrom, delimiterLength) {
  let candidateStart = line.indexOf('`', searchFrom);
  while (candidateStart >= 0) {
    let candidateEnd = candidateStart;
    while (line[candidateEnd] === '`') candidateEnd += 1;
    if (candidateEnd - candidateStart === delimiterLength) return candidateStart;
    candidateStart = line.indexOf('`', candidateEnd);
  }
  return -1;
}

function transformRawRestPathsOutsideInlineCodeSpans(line, inlineCodeState) {
  let result = '';
  let cursor = 0;

  while (cursor < line.length) {
    if (inlineCodeState.delimiterLength !== null) {
      const closingStart = findInlineCodeClosingRun(line, cursor, inlineCodeState.delimiterLength);
      if (closingStart < 0) {
        return result + line.slice(cursor);
      }
      const closingEnd = closingStart + inlineCodeState.delimiterLength;
      result += line.slice(cursor, closingEnd);
      cursor = closingEnd;
      inlineCodeState.delimiterLength = null;
      continue;
    }

    const tickStart = line.indexOf('`', cursor);
    if (tickStart < 0) {
      result += transformRawRestPathsOutsideInlineCode(line.slice(cursor));
      break;
    }

    result += transformRawRestPathsOutsideInlineCode(line.slice(cursor, tickStart));
    let delimiterEnd = tickStart;
    while (line[delimiterEnd] === '`') delimiterEnd += 1;
    const delimiterLength = delimiterEnd - tickStart;
    const closingStart = findInlineCodeClosingRun(line, delimiterEnd, delimiterLength);

    if (closingStart < 0) {
      result += line.slice(tickStart);
      inlineCodeState.delimiterLength = delimiterLength;
      break;
    }

    const closingEnd = closingStart + delimiterLength;
    result += line.slice(tickStart, closingEnd);
    cursor = closingEnd;
  }

  return result;
}

function transformRawRestPathPlaceholders(markdown) {
  const chunks = markdown.split(/(\r?\n)/);
  let activeFence = null;
  const inlineCodeState = { delimiterLength: null };

  for (let index = 0; index < chunks.length; index += 2) {
    const line = chunks[index];
    if (activeFence) {
      const closingFence = line.match(/^ {0,3}(`+|~+)\s*$/);
      if (
        closingFence &&
        closingFence[1][0] === activeFence.character &&
        closingFence[1].length >= activeFence.length
      ) {
        activeFence = null;
      }
      continue;
    }

    if (inlineCodeState.delimiterLength === null) {
      const openingFence = line.match(/^ {0,3}(`{3,}|~{3,})/);
      if (openingFence) {
        activeFence = { character: openingFence[1][0], length: openingFence[1].length };
        continue;
      }
    }

    chunks[index] = transformRawRestPathsOutsideInlineCodeSpans(line, inlineCodeState);
  }

  return chunks.join('');
}

function copyContractAssets() {
  const contractsRoot = path.join(sourceDocsRoot, 'contracts');
  for (const file of walk(contractsRoot)) {
    if (path.extname(file).toLowerCase() === '.md') continue;
    const relativePath = path.relative(contractsRoot, file);
    const target = path.join(stagedStaticRoot, 'contracts', relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(file, target);
  }
}

function copyReferenceSourceMarkdown() {
  for (const sourceRelativePath of archivedOtherMarkdown) {
    const source = path.join(sourceDocsRoot, ...sourceRelativePath.split('/'));
    if (!fs.existsSync(source) || !fs.statSync(source).isFile()) {
      throw new Error(`Missing historical Markdown source: ${source}`);
    }

    const archiveRelativePath = path.posix.join('reference', 'source', `${sourceRelativePath.slice('other/'.length)}.txt`);
    const target = path.join(stagedStaticRoot, ...archiveRelativePath.split('/'));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  }
}

fs.rmSync(stagingRoot, { recursive: true, force: true });
fs.mkdirSync(stagedDocsRoot, { recursive: true });
fs.mkdirSync(stagedStaticRoot, { recursive: true });

const sourceFiles = [...sourceFolders.keys()].flatMap((folder) => walk(path.join(sourceDocsRoot, folder)));
const markdownFiles = sourceFiles.filter((file) => {
  if (path.extname(file).toLowerCase() !== '.md') return false;
  const sourceRelativePath = toPosix(path.relative(sourceDocsRoot, file));
  return !sourceRelativePath.startsWith('other/') || renderedOtherMarkdown.has(sourceRelativePath);
});
const missingLinks = [];

for (const sourceFile of markdownFiles) {
  const sourceRelativePath = path.relative(sourceDocsRoot, sourceFile);
  const sourceStagedPath = stagedDocumentPath(sourceRelativePath);
  const sourceGroup = toPosix(sourceRelativePath).split('/')[0];
  const target = path.join(stagedDocsRoot, sourceStagedPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });

  let content = fs.readFileSync(sourceFile, 'utf8');
  content = rewriteMarkdown(content, sourceFile, sourceStagedPath, sourceGroup, missingLinks);
  if (sourceRelativePath === path.join('contracts', 'api-contract.md')) {
    content = transformRawRestPathPlaceholders(content);
  }

  const normalizedSourcePath = toPosix(sourceRelativePath);
  const frontmatterValues = {};
  const sidebarPosition = ersSidebarPositions.get(normalizedSourcePath);
  if (sidebarPosition !== undefined) frontmatterValues.sidebar_position = sidebarPosition;
  if (normalizedSourcePath === 'ers/README.md') frontmatterValues.slug = '/specification/';
  if (normalizedSourcePath === 'product/README.md') frontmatterValues.slug = '/product/';
  if (Object.keys(frontmatterValues).length) content = mergeFrontmatter(content, frontmatterValues);
  fs.writeFileSync(target, content, 'utf8');
}

const sourceAssets = path.join(sourceDocsRoot, 'assets');
if (fs.existsSync(sourceAssets)) fs.cpSync(sourceAssets, path.join(stagedDocsRoot, 'assets'), { recursive: true });
copyContractAssets();
copyReferenceSourceMarkdown();

const bundleSource = path.join(sourceDocsRoot, 'contracts', 'api', 'dist', 'openapi.yaml');
if (!fs.existsSync(bundleSource)) throw new Error(`Missing canonical OpenAPI bundle: ${bundleSource}`);
const bundleTarget = path.join(stagedStaticRoot, 'api', 'openapi.yaml');
fs.mkdirSync(path.dirname(bundleTarget), { recursive: true });
fs.copyFileSync(bundleSource, bundleTarget);

const legacyLinks = missingLinks.filter(({ group }) => group === 'other');
if (legacyLinks.length) {
  console.warn(`Preserving ${legacyLinks.length} unresolved historical reference link(s) from docs/other/.`);
  for (const { detail } of legacyLinks) console.warn(`  ${detail}`);
}

console.log(`Prepared ${markdownFiles.length} Markdown documents in ${stagingRoot}.`);
console.log(`Copied ${archivedOtherMarkdown.size} historical Markdown source file(s) as static .md.txt assets.`);
console.log('Routes: /specification/, /product/, /reference/, and /contracts/.');
console.log('OpenAPI bundle: static/api/openapi.yaml.');
