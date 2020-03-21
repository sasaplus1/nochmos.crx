import { h } from 'preact';

import CandidateList, {
  Props as CandidateListProps
} from '../CandidateList/index';
import QueryInput, { Props as QueryInputProps } from '../QueryInput/index';

export type Props = {
  candidateMaxCount: CandidateListProps['maxCount'];
  candidates: CandidateListProps['candidates'];
  onClickCandidate: CandidateListProps['onClick'];
  onInputQuery: QueryInputProps['onInput'];
  onKeyDownInInput: QueryInputProps['onKeyDown'];
};

export default function PopupPage(props: Props) {
  const {
    candidateMaxCount,
    candidates,
    onClickCandidate,
    onInputQuery,
    onKeyDownInInput
  } = props;

  return (
    <div className="PopupPage">
      <QueryInput onInput={onInputQuery} onKeyDown={onKeyDownInInput} />
      <CandidateList
        candidates={candidates}
        maxCount={candidateMaxCount}
        onClick={onClickCandidate}
      />
    </div>
  );
}
