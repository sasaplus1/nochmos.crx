import { h } from 'preact';
import { action } from '@storybook/addon-actions';
import { number, object, withKnobs } from '@storybook/addon-knobs';

import Component from './index';

export default { decorators: [withKnobs], title: Component.name };

export function Base() {
  return (
    <Component
      candidates={object('candidates', [
        {
          iconUrlSrcSet: 'https://github.githubassets.com/favicon.ico',
          isSelect: false,
          title: 'GitHub',
          url: 'https://github.com'
        },
        {
          iconUrlSrcSet: 'https://github.githubassets.com/favicon.ico',
          isSelect: true,
          title: 'GitHub',
          url: 'https://github.com'
        },
        {
          iconUrlSrcSet: 'https://github.githubassets.com/favicon.ico',
          isSelect: false,
          title: 'GitHub',
          url: 'https://github.com'
        }
      ])}
      maxCount={number('maxCount', 9)}
      onClick={action('click')}
    />
  );
}
