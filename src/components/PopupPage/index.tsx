import { h } from 'preact';

import CandidateList, {
  Props as CandidateListProps
} from '../CandidateList/index';
import QueryInput, { Props as QueryInputProps } from '../QueryInput/index';

export type Props = {
  candidates: CandidateListProps['candidates'];
  onClickCandidate: CandidateListProps['onClick'];
  onInputQuery: QueryInputProps['onInput'];
  onKeyDownInInput: QueryInputProps['onKeyDown'];
  selectedCandidate: CandidateListProps['selectedCandidate'];
};

export default function PopupPage(props: Props) {
  const {
    candidates,
    onClickCandidate,
    onInputQuery,
    onKeyDownInInput,
    selectedCandidate
  } = props;

  return (
    <div className="PopupPage">
      <QueryInput onInput={onInputQuery} onKeyDown={onKeyDownInInput} />
      <CandidateList
        candidates={candidates}
        onClick={onClickCandidate}
        selectedCandidate={selectedCandidate}
      />
    </div>
  );
}
