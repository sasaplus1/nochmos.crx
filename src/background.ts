export type OpenUrlAction = {
  type: 'open_url';
  payload: {
    url: string;
  };
};

export type BackgroundAction<T> = T extends { type: 'open_url' }
  ? OpenUrlAction
  : never;

/**
 * type guard function for OpenUrlAction
 *
 * @param action
 */
function isOpenUrlAction(action: unknown): action is OpenUrlAction {
  if (typeof action === 'object' && action !== null) {
    return (action as OpenUrlAction).type === 'open_url';
  }

  return false;
}

/**
 * get all tabs
 */
async function getAllTabs() {
  /**
   * NOTE: cannot get all tabs even if use the following codes:
   *
   * ```ts
   * const tabs = await new Promise<chrome.tabs.Tab[]>(resolve =>
   *   chrome.tabs.query({ url }, resolve)
   * );
   * ```
   */

  const windows = await new Promise<chrome.windows.Window[]>((resolve) =>
    chrome.windows.getAll({ populate: true }, resolve)
  );

  const tabs: chrome.tabs.Tab[] = windows
    .flatMap((win) => {
      if (typeof win.tabs === 'undefined') {
        return null;
      }

      return win.tabs;
    })
    .filter(
      // NOTE: TypeScript is guess to type chrome.tabs.Tab[] when use type guard.
      // otherwise guess to (chrome.tabs.Tab | null)[].
      (tab): tab is chrome.tabs.Tab => tab !== null
    );

  return tabs.map<Pick<chrome.tabs.Tab, 'id' | 'url' | 'windowId'>>((tab) => {
    const { id, url, windowId } = tab;

    return {
      id,
      url,
      windowId
    };
  });
}

/**
 * open URL
 *
 * @param candidate
 */
async function openUrl(data: OpenUrlAction['payload']) {
  const { url } = data;

  const tabs = await getAllTabs();

  const [tab] = tabs.filter((tab) => tab.url === url);

  const windowId =
    tab && tab.windowId && tab.windowId !== chrome.windows.WINDOW_ID_NONE
      ? tab.windowId
      : await new Promise<number>((resolve) =>
          chrome.windows.getCurrent((win) => resolve(win.id))
        );

  await new Promise((resolve) =>
    chrome.windows.update(windowId, { focused: true }, resolve)
  );

  const tabId = tab ? tab.id : chrome.tabs.TAB_ID_NONE;

  if (tabId === undefined || tabId === chrome.tabs.TAB_ID_NONE) {
    await new Promise((resolve) =>
      chrome.tabs.create({ url, active: true }, resolve)
    );
  } else {
    await new Promise((resolve) =>
      chrome.tabs.update(tabId, { active: true }, resolve)
    );
  }
}

function onMessage(message: unknown) {
  if (isOpenUrlAction(message)) {
    openUrl(message.payload);
  }
}

chrome.runtime.onMessage.addListener(onMessage);
