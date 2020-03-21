import { h, Component, createRef } from 'preact';

export type Props = {
  onInput: h.JSX.GenericEventHandler<HTMLInputElement>;
  onKeyDown: h.JSX.GenericEventHandler<HTMLInputElement>;
};

export default class QueryInput extends Component<Props> {
  ref = createRef<HTMLInputElement>();

  componentDidMount() {
    const element = this.ref.current;

    if (element) {
      element.focus();
    }
  }

  render() {
    const { onInput, onKeyDown } = this.props;

    return (
      <input
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="QueryInput"
        onInput={onInput}
        onKeyDown={onKeyDown}
        ref={this.ref}
        spellCheck="false"
        type="text"
      />
    );
  }
}
