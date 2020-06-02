import { h } from 'preact';

export type Props = {
  onInput: h.JSX.GenericEventHandler<HTMLInputElement>;
  onKeyDown: h.JSX.KeyboardEventHandler<HTMLInputElement>;
};

export default function QueryInput(props: Props) {
  const { onInput, onKeyDown } = props;

  return (
    <input
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      autoFocus
      className="QueryInput"
      onInput={onInput}
      onKeyDown={onKeyDown}
      spellCheck="false"
      type="text"
    />
  );
}
