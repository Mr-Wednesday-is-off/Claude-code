import { searchIndex } from './searchIndex';
import { searchAliases } from './searchAliases';

function normalize(str) {
  return str.toLowerCase().trim();
}

function expandQuery(tokens) {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    const aliases = searchAliases[token];
    if (aliases) {
      aliases.forEach(a => expanded.add(a.toLowerCase()));
    }
  }
  return [...expanded];
}

function editDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i - 1] === a[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

function fuzzyMatch(query, target) {
  if (target.includes(query)) return true;
  if (query.length >= 4 && target.length >= 4) {
    return editDistance(query, target) <= 2;
  }
  return false;
}

function scoreEntry(entry, expandedTokens) {
  let score = 0;
  const titleLower = entry.title.toLowerCase();
  const descLower = entry.description.toLowerCase();

  for (const token of expandedTokens) {
    if (titleLower.includes(token)) score += 5;

    for (const kw of entry.keywords) {
      if (kw === token) {
        score += 3;
      } else if (kw.includes(token) || token.includes(kw)) {
        score += 1;
      } else if (fuzzyMatch(token, kw)) {
        score += 0.5;
      }
    }

    if (descLower.includes(token)) score += 1;
  }

  return score;
}

export function search(query, maxResults = 5) {
  const normalized = normalize(query);
  if (!normalized) return [];

  const tokens = normalized.split(/\s+/).filter(Boolean);
  const expandedTokens = expandQuery(tokens);

  return searchIndex
    .map(entry => ({ ...entry, score: scoreEntry(entry, expandedTokens) }))
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}
