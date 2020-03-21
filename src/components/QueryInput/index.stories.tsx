import { h } from 'preact';
import { action } from '@storybook/addon-actions';

import Component from './index';

export default { title: Component.name };

export function Base() {
  return (
    <Component onInput={action('onInput')} onKeyDown={action('onKeyDown')} />
  );
}
