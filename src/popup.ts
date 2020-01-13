import Fuse from 'fuse.js';

const store = {
  map: new Map(),
  selectIndex: 0
};

//------------------------------------------------------------------------------

function createCandidateElement(props: {
  favIconUrl: string;
  id: number;
  isSelect: boolean;
  title: string;
  url: string;
}): HTMLLIElement {
  const { favIconUrl, id, isSelect, title, url } = props;

  const htmlElements = [
    `<img class="item__favicon" src="${favIconUrl}" width="32" height="32">`,
    `<div class="item__keys">`,
    `<div class="item__title">${title}</div>`,
    `<div class="item__url">${url}</div>`,
    `</div>`
  ];

  const html = htmlElements.join('');

  const li = document.createElement('li');

  li.insertAdjacentHTML('afterbegin', html);
  li.classList.add('candidates-area__item', 'item');

  if (isSelect) {
    li.classList.add('select');
  }

  li.addEventListener('click', () => {
    if (!Number.isSafeInteger(id)) {
      // create tab
      chrome.tabs.create({ url, active: true });
    }

    chrome.tabs.get(
      typeof id !== 'number' ? parseInt(id, 10) : id,
      (tab: chrome.tabs.Tab) => {
        if (!tab || tab.id === chrome.tabs.TAB_ID_NONE) {
          // create tab
          chrome.tabs.create({ url, active: true });
        } else {
          chrome.windows.getCurrent(win => {
            // active tab
            if (win.id === tab.windowId) {
              chrome.tabs.update(tab.id as number, { active: true });
            } else {
              chrome.windows.update(tab.windowId, { focused: true }, () => {
                chrome.tabs.update(tab.id as number, { active: true });
              });
            }
          });
        }
      }
    );
  });

  return li;
}

//------------------------------------------------------------------------------

function onInput(event: Event): void {
  const text = (event.currentTarget as HTMLInputElement).value;

  const list = Array.from(store.map.values()).flat(1);

  const fuse = new Fuse(list, {
    findAllMatches: true,
    keys: ['title', 'url'],
    maxPatternLength: 9,
    shouldSort: true
  });

  const result = fuse.search(text);

  const candidates = document.getElementById('js-candidates');

  const items = result
    .slice(0, 9)
    .map(candidate => createCandidateElement(candidate));

  const fragment = document.createDocumentFragment();

  for (const candidate of items) {
    fragment.appendChild(candidate);
  }

  if (!candidates) {
    return;
  }

  candidates.innerHTML = '';
  candidates.append(fragment);
}

function onKeydown(event: KeyboardEvent): void {
  const { ctrlKey, key } = event;

  if (key === 'Enter') {
    event.preventDefault();

    const candidates = document.getElementById('js-candidates');

    if (!candidates) {
      return;
    }

    if (candidates.firstChild) {
      (candidates.firstChild as HTMLLIElement).click();
    }
  }

  if (ctrlKey && key === 'n') {
    event.preventDefault();
    store.selectIndex += 1;
  }

  if (ctrlKey && key === 'p') {
    event.preventDefault();
    store.selectIndex -= 1;
  }
}

function onDOMContentLoaded(): void {
  const input = document.getElementById('js-input');

  if (input) {
    input.addEventListener('keydown', onKeydown, { passive: false });
    input.addEventListener('input', onInput);
    input.focus();
  }

  // get tabs
  chrome.tabs.query({}, function(tabs) {
    store.map.set('tabs', tabs);
  });

  // get histories
  chrome.history.search({ text: '' }, function(historyItems) {
    store.map.set('histories', historyItems);
  });

  // get bookmarks
  chrome.bookmarks.search({ url: '' }, function(bookmarkTreeNodes) {
    store.map.set('bookmarks', bookmarkTreeNodes);
  });

  // get most visited URLs
  chrome.topSites.get(function(mostVisitedURLs) {
    store.map.set('most-visited-urls', mostVisitedURLs);
  });
}

//------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
