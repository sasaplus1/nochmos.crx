import { h } from 'preact';
import { action } from '@storybook/addon-actions';
import { object, withKnobs } from '@storybook/addon-knobs';

import Component from './index';

export default { decorators: [withKnobs], title: Component.name };

export function Base() {
  return (
    <Component
      candidates={object('candidates', [
        {
          iconUrlSrcSet: 'https://github.githubassets.com/favicon.ico',
          id: 1,
          kind: 'bookmarks',
          title: 'GitHub',
          url: 'https://github.com'
        },
        {
          iconUrlSrcSet: 'https://github.githubassets.com/favicon.ico',
          id: 2,
          kind: 'bookmarks',
          title: 'GitHub',
          url: 'https://github.com'
        },
        {
          iconUrlSrcSet: 'https://github.githubassets.com/favicon.ico',
          id: 3,
          kind: 'bookmarks',
          title: 'GitHub',
          url: 'https://github.com'
        }
      ])}
      selectedCandidate={object('selectedCandidate', {
        iconUrlSrcSet: 'https://github.githubassets.com/favicon.ico',
        id: 2,
        kind: 'bookmarks',
        title: 'GitHub',
        url: 'https://github.com'
      })}
      onClickCandidate={action('onClickCandidate')}
      onInputQuery={action('onInputQuery')}
      onKeyDownInInput={action('onKeyDownInInput')}
    />
  );
}
