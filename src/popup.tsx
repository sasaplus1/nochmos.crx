import * as Comlink from 'comlink';
import { h, render } from 'preact';
import { useCallback, useEffect, useReducer, useState } from 'preact/hooks';

import candidatesReducer, {
  Candidate,
  initialState,
  updateCandidates,
  updateSelectedCandidateAction
} from './modules/candidates';

import PopupPage from './components/PopupPage/index';

import { OpenUrlAction } from './background';

/**
 * Web Workers for fuzzy find processing
 */
const workers: Set<Worker> = new Set();

/**
 * open URL
 *
 * @param url
 */
async function openUrl(url: string) {
  const openUrlAction: OpenUrlAction = {
    type: 'open_url',
    payload: {
      url
    }
  };

  await new Promise(resolve =>
    chrome.runtime.sendMessage(openUrlAction, resolve)
  );
}

/**
 * get previous candidate at index
 *
 * @param currentCandidate
 * @param candidates
 * @return candidate
 */
function getPrevCandidate(
  currentCandidate: Candidate,
  candidates: Candidate[]
) {
  const index = candidates.findIndex(
    candidate => candidate.id === currentCandidate.id
  );

  if (index <= 0) {
    return currentCandidate;
  }

  return candidates[index - 1];
}

/**
 * get next candidate at index
 *
 * @param currentCandidate
 * @param candidates
 * @return candidate
 */
function getNextCandidate(
  currentCandidate: Candidate,
  candidates: Candidate[]
) {
  const index = candidates.findIndex(
    candidate => candidate.id === currentCandidate.id
  );

  if (index >= candidates.length) {
    return currentCandidate;
  }

  return candidates[index + 1];
}

/**
 * root component
 */
function Popup() {
  const [state, dispatch] = useReducer(candidatesReducer, initialState);

  const { candidates, selectedCandidate } = state;

  const [popupCandidates, setPopupCandidates] = useState(
    candidates.slice(0, 9)
  );

  useEffect(function() {
    updateCandidates(dispatch);
  }, []);

  const onClickCandidate = useCallback(function(candidate: Candidate) {
    const { url } = candidate;

    openUrl(url).then(function() {
      window.close();
    });
  }, []);

  const onInputQuery = useCallback(
    async function(event: h.JSX.TargetedEvent<HTMLInputElement>) {
      const text = event.currentTarget.value;

      // remove candidates if text is empty
      if (text === '') {
        setPopupCandidates([]);
        dispatch(updateSelectedCandidateAction({ id: null }));

        return;
      }

      // terminate if already worked
      for (const worker of workers) {
        worker.terminate();
      }

      workers.clear();

      const worker = new Worker('./worker.js');

      workers.add(worker);

      const fuzzySearch = Comlink.wrap<import('./worker').exports>(worker);

      const filteredCandidates = await fuzzySearch(candidates, text);
      const slicedCandidates = filteredCandidates.slice(0, 9);

      setPopupCandidates(slicedCandidates);

      const [selectedCandidate] = slicedCandidates;

      dispatch(updateSelectedCandidateAction(selectedCandidate));
    },
    [candidates]
  );

  const onKeyDownInInput = useCallback(
    function(event: h.JSX.TargetedKeyboardEvent<HTMLInputElement>) {
      const { altKey, ctrlKey, isComposing, key, metaKey, shiftKey } = event;

      if (isComposing) {
        return;
      }

      const isNeutral = !altKey && !ctrlKey && !metaKey && !shiftKey;

      if (isNeutral && key === 'Enter') {
        event.preventDefault();

        if (selectedCandidate) {
          const { url } = selectedCandidate;

          openUrl(url).then(function() {
            window.close();
          });
        }

        return;
      }

      if ((ctrlKey && key === 'n') || (isNeutral && key === 'ArrowDown')) {
        event.preventDefault();

        if (!selectedCandidate) {
          return;
        }

        const nextCandidate = getNextCandidate(
          selectedCandidate,
          popupCandidates
        );

        dispatch(updateSelectedCandidateAction(nextCandidate));

        return;
      }

      if ((ctrlKey && key === 'p') || (isNeutral && key === 'ArrowUp')) {
        event.preventDefault();

        if (!selectedCandidate) {
          return;
        }

        const prevCandidate = getPrevCandidate(
          selectedCandidate,
          popupCandidates
        );

        dispatch(updateSelectedCandidateAction(prevCandidate));

        return;
      }
    },
    [selectedCandidate, popupCandidates]
  );

  return (
    <PopupPage
      candidates={popupCandidates}
      onClickCandidate={onClickCandidate}
      onInputQuery={onInputQuery}
      onKeyDownInInput={onKeyDownInInput}
      selectedCandidate={selectedCandidate}
    />
  );
}

/**
 * entry point
 */
function onDOMContentLoaded() {
  const renderElement = document.getElementById('js-root');

  if (renderElement !== null) {
    render(<Popup />, renderElement);
  }
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
