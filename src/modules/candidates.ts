import actionCreatorFactory, { AnyAction } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

/* types */

export type CandidateKind =
  | 'bookmarks'
  | 'histories'
  | 'mostVisitedURLs'
  | 'tabs';

export type Candidate = {
  iconUrlSrcSet: string;
  id: number;
  kind: CandidateKind;
  title: string;
  url: string;
};

type State = {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
};

/* actions */

const actionCreator = actionCreatorFactory('popup');

export const clearCandidatesAction = actionCreator<void>('clearCandidates');
export const updateCandidatesAction = actionCreator<{
  candidates: Candidate[];
}>('updateCandidates');
export const updateSelectedCandidateAction = actionCreator<{
  id: number | null;
}>('updateSelectedCandidate');

/* reducer */

export const initialState: State = {
  candidates: [],
  selectedCandidate: null
};

const reducer = reducerWithInitialState(initialState)
  .case(clearCandidatesAction, function() {
    return {
      candidates: [],
      selectedCandidate: null
    };
  })
  .case(updateCandidatesAction, function(state, payload) {
    const { candidates } = payload;

    const convertedCandidates = candidates.map(candidate => ({
      ...candidate,
      id: NaN
    }));

    const clonedCandidates: Candidate[] = JSON.parse(
      JSON.stringify(state.candidates)
    );

    const newCandidates = clonedCandidates
      .concat(convertedCandidates)
      .map((candidate, index) => ({
        ...candidate,
        id: index + 1
      }));

    return {
      candidates: newCandidates,
      selectedCandidate: state.selectedCandidate
    };
  })
  .case(updateSelectedCandidateAction, function(state, payload) {
    const { id } = payload;

    const candidate = state.candidates.find(candidate => candidate.id === id);

    return {
      candidates: state.candidates,
      selectedCandidate: candidate || null
    };
  });

export default reducer;

/* side effects */

export function getTabs(): Promise<Candidate[]> {
  return new Promise(function(resolve) {
    // get tabs
    chrome.tabs.query({}, function(tabs) {
      const candidates: Candidate[] = tabs.map(
        ({ favIconUrl = '', title = '', url = '' }) => ({
          iconUrlSrcSet: favIconUrl,
          id: NaN,
          kind: 'tabs',
          title,
          url
        })
      );

      resolve(candidates);
    });
  });
}

export function getHistories(): Promise<Candidate[]> {
  return new Promise(function(resolve) {
    // get histories
    chrome.history.search({ text: '', startTime: 0, maxResults: 0 }, function(
      historyItems
    ) {
      const candidates: Candidate[] = historyItems.map(
        ({ title = '', url = '' }) => ({
          iconUrlSrcSet: '',
          id: NaN,
          kind: 'histories',
          title,
          url
        })
      );

      resolve(candidates);
    });
  });
}

export function getBookmarks(): Promise<Candidate[]> {
  return new Promise(function(resolve) {
    // get bookmarks
    chrome.bookmarks.search({ url: '' }, function(bookmarkTreeNodes) {
      const candidates: Candidate[] = bookmarkTreeNodes.map(
        ({ title = '', url = '' }) => ({
          iconUrlSrcSet: '',
          id: NaN,
          kind: 'bookmarks',
          title,
          url
        })
      );

      resolve(candidates);
    });
  });
}

export function getTopSites(): Promise<Candidate[]> {
  return new Promise(function(resolve) {
    // get most visited URLs
    chrome.topSites.get(function(mostVisitedURLs) {
      const candidates: Candidate[] = mostVisitedURLs.map(
        ({ title = '', url = '' }) => ({
          iconUrlSrcSet: '',
          id: NaN,
          kind: 'mostVisitedURLs',
          title,
          url
        })
      );

      resolve(candidates);
    });
  });
}

export async function updateCandidates(dispatch: (action: AnyAction) => void) {
  const results = await Promise.all([
    getTopSites(),
    getTabs(),
    getBookmarks(),
    getHistories()
  ]);

  const candidates = results.flat();

  dispatch(
    updateCandidatesAction({
      candidates
    })
  );
}
