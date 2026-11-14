import { searchIndex } from './searchIndex';
import { searchAliases } from './searchAliases';
import es from './locales/es.json';
import { keywords as esKeywords, aliases as esAliases } from './locales/es.search';

// Lowercase and strip accents, so "policía" and "policia" match.
function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

const translate = (dict, text) => (dict && dict[text]) || text;

// Per-language view of the index: translated title and description, plus
// extra keywords in that language on top of the English ones.
function buildIndex(dict, extraKeywords) {
  return searchIndex.map((entry) => {
    const title = translate(dict, entry.title);
    const description = translate(dict, entry.description);
    const keywords = [...entry.keywords, ...((extraKeywords && extraKeywords[entry.id]) || [])];
    return {
      ...entry,
      title,
      description,
      titleNorm: normalize(title),
      descNorm: normalize(description),
      keywordsNorm: keywords.map(normalize),
    };
  });
}

function normalizeAliases(...maps) {
  const out = {};
  for (const map of maps) {
    for (const [key, values] of Object.entries(map)) {
      const k = normalize(key);
      out[k] = [...(out[k] || []), ...values.map(normalize)];
    }
  }
  return out;
}

const languages = {
  en: { index: buildIndex(null, null), aliases: normalizeAliases(searchAliases) },
  es: { index: buildIndex(es, esKeywords), aliases: normalizeAliases(searchAliases, esAliases) },
};

function expandQuery(tokens, aliases) {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    (aliases[token] || []).forEach((alias) => expanded.add(alias));
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

// "arrestaron" and "arrestado", or "arrested" and "arrest", share a word stem.
const STEM_LENGTH = 6;
function sharesStem(token, keyword) {
  if (token.length < STEM_LENGTH) return false;
  const stem = token.slice(0, STEM_LENGTH);
  return keyword.split(' ').some((word) => word.startsWith(stem));
}

// Small words that match almost everything and only add noise.
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'to', 'of', 'in', 'on', 'my', 'me', 'i', 'is', 'do', 'if', 'it', 'at', 'or', 'and',
  'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'al', 'en', 'mi', 'me', 'se', 'lo', 'le', 'que', 'si', 'y', 'o', 'es',
]);

function scoreEntry(entry, expandedTokens) {
  let score = 0;

  for (const token of expandedTokens) {
    if (entry.titleNorm.includes(token)) score += 5;

    for (const kw of entry.keywordsNorm) {
      if (kw === token) {
        score += 3;
      } else if (kw.includes(token) || token.includes(kw)) {
        score += 1;
      } else if (sharesStem(token, kw)) {
        score += 2;
      } else if (fuzzyMatch(token, kw)) {
        score += 0.5;
      }
    }

    if (entry.descNorm.includes(token)) score += 1;
  }

  return score;
}

export function search(query, lang = 'en', maxResults = 5) {
  const normalized = normalize(query);
  if (!normalized) return [];

  const { index, aliases } = languages[lang] || languages.en;
  const words = normalized.split(/\s+/).filter(Boolean);
  const meaningful = words.filter((word) => !STOP_WORDS.has(word));
  const tokens = meaningful.length > 0 ? meaningful : words;
  const expandedTokens = expandQuery(tokens, aliases);

  return index
    .map((entry) => ({ ...entry, score: scoreEntry(entry, expandedTokens) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}
