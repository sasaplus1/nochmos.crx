import * as Comlink from 'comlink';
import Fuse from 'fuse.js';

import { Candidate } from './modules/candidates';

/**
 * fuzzy search
 *
 * @param candidates
 * @param text
 */
export function fuzzySearch(candidates: Candidate[], text: string) {
  const fuse = new Fuse(candidates, {
    // findAllMatches: true,
    keys: ['title', 'url'],
    maxPatternLength: 9,
    // shouldSort: true,
    useExtendedSearch: true
  });

  return fuse.search(text);
}

export type exports = typeof fuzzySearch;

Comlink.expose(fuzzySearch);
