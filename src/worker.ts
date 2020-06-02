import * as Comlink from 'comlink';
import Fuse from 'fuse.js';

import { Candidate } from './modules/candidates';

/**
 * fuzzy search
 *
 * @param candidates
 * @param text
 */
export function fuzzySearch(
  candidates: Candidate[],
  text: string
): Fuse.FuseResult<Candidate>[] {
  const keys = ['title', 'url'];

  const index = Fuse.createIndex(keys, candidates);

  const fuse = new Fuse(
    candidates,
    {
      // findAllMatches: true,
      keys,
      maxPatternLength: 9,
      // shouldSort: true,
      useExtendedSearch: true
    },
    index
  );

  return fuse.search(text);
}

export type exports = typeof fuzzySearch;

Comlink.expose(fuzzySearch);
