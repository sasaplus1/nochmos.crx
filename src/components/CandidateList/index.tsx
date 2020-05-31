import { h } from 'preact';
import cx from 'classnames';

import { Candidate } from '../../modules/candidates';

export type Props = {
  candidates: Candidate[];
  onClick: (
    candidate: Candidate,
    event: h.JSX.TargetedEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  selectedCandidate: Candidate | null;
};

export default function CandidateList(props: Props) {
  const { candidates, onClick, selectedCandidate } = props;

  const { id: selectedId } = selectedCandidate || { id: NaN };

  return (
    <ul className="CandidateList">
      {candidates.map(function(candidate) {
        const { iconUrlSrcSet, id, title, url } = candidate;

        return (
          <li key={iconUrlSrcSet + title + url}>
            <button
              className={cx('Candidate', {
                Select: id === selectedId
              })}
              type="button"
              onClick={event => onClick(candidate, event)}
            >
              <img
                className="Icon"
                srcSet={iconUrlSrcSet || 'fallback.svg'}
                width="32"
                height="32"
              />
              <div className="Informations">
                <div className="Title">{title}</div>
                <div className="Url">{url}</div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
