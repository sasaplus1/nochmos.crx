import { h } from 'preact';
import cx from 'classnames';

export type Candidate = {
  iconUrlSrcSet: string;
  isSelect: boolean;
  title: string;
  url: string;
};

export type Props = {
  candidates: Candidate[];
  maxCount: number;
  onClick: h.JSX.GenericEventHandler<HTMLLIElement>;
};

export default function CandidateList(props: Props) {
  const { candidates, maxCount, onClick } = props;

  return (
    <ul className="CandidateList">
      {candidates.slice(0, maxCount).map(function(candidate) {
        const { iconUrlSrcSet, isSelect, title, url } = candidate;

        return (
          <li
            className={cx('Candidate', { Select: isSelect })}
            key={iconUrlSrcSet + title + url}
            onClick={onClick}
          >
            <img
              className="Icon"
              srcSet={iconUrlSrcSet}
              width="32"
              height="32"
            />
            <div className="Informations">
              <div className="Title">{title}</div>
              <div className="Url">{url}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
