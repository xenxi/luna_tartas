import { normalizeQuery, tokenizeQuery } from './normalize-query';
import type {
  RankedSearchResult,
  SearchEntry,
  SearchField,
  SearchIndex,
} from './types';

function editDistance(left: string, right: string): number {
  const rows = Array.from({ length: left.length + 1 }, (_, index) => index);

  for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
    let diagonal = rows[0];
    rows[0] = rightIndex;

    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      const previousRow = rows[leftIndex];
      rows[leftIndex] = Math.min(
        rows[leftIndex] + 1,
        rows[leftIndex - 1] + 1,
        diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
      diagonal = previousRow;
    }
  }

  return rows[left.length];
}

function isAdjacentTransposition(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  const differences = [...left].flatMap((character, index) =>
    character === right[index] ? [] : [index],
  );
  if (differences.length !== 2 || differences[1] !== differences[0] + 1) {
    return false;
  }
  const [first, second] = differences;
  return left[first] === right[second] && left[second] === right[first];
}

function fuzzyTokenScore(queryToken: string, candidateToken: string): number {
  if (candidateToken === queryToken) return 1;
  if (candidateToken.startsWith(queryToken)) return 0.9;
  if (queryToken.length >= 3 && candidateToken.includes(queryToken))
    return 0.76;

  const maximumDistance = queryToken.length >= 4 ? 1 : 0;
  if (Math.abs(candidateToken.length - queryToken.length) > maximumDistance) {
    return 0;
  }

  const distance = isAdjacentTransposition(queryToken, candidateToken)
    ? 1
    : editDistance(queryToken, candidateToken);
  if (distance > maximumDistance) return 0;
  return 0.68 - distance * 0.12;
}

function fieldScore(
  field: SearchField,
  queryTokens: readonly string[],
): number {
  const candidateTokens = tokenizeQuery(field.normalized);
  let score = 0;

  for (const queryToken of queryTokens) {
    let best = 0;
    for (const candidateToken of candidateTokens) {
      best = Math.max(best, fuzzyTokenScore(queryToken, candidateToken));
    }
    score += best * field.weight;
  }

  return score;
}

function scoreEntry(entry: SearchEntry, query: string): number {
  const normalized = normalizeQuery(query);
  const queryTokens = tokenizeQuery(normalized);
  if (queryTokens.length === 0) return 0;

  const tokenMatches = queryTokens.map((token) =>
    Math.max(
      ...entry.fields.map((candidate) =>
        Math.max(
          ...tokenizeQuery(candidate.normalized).map((candidateToken) =>
            fuzzyTokenScore(token, candidateToken),
          ),
          0,
        ),
      ),
    ),
  );
  if (tokenMatches.some((match) => match === 0)) return 0;

  let score = Math.max(
    ...entry.fields.map((item) => fieldScore(item, queryTokens)),
  );

  if (entry.normalizedName === normalized) score += 360;
  else if (entry.normalizedName.startsWith(normalized)) score += 260;
  else if (entry.normalizedName.includes(normalized)) score += 190;

  if (entry.kind === 'product') score += 8;
  return score;
}

export function rankSearchResults(
  index: SearchIndex,
  query: string,
): readonly RankedSearchResult[] {
  const normalized = normalizeQuery(query);
  if (normalized.length < 2) return [];

  return index.entries
    .map((entry) => ({ entry, score: scoreEntry(entry, normalized) }))
    .filter((result) => result.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.entry.name.localeCompare(right.entry.name, 'es') ||
        left.entry.key.localeCompare(right.entry.key),
    );
}
