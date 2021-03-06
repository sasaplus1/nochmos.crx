module.exports = {
  manifest_version: 2,
  name: 'nochmos',
  version: '1.0.2',
  description: 'fuzzy find from some sources',
  icons: {
    '16': 'icon_16.png',
    '32': 'icon_32.png',
    '64': 'icon_64.png',
    '128': 'icon_128.png'
  },
  background: {
    persistent: false,
    scripts: ['background.js']
  },
  browser_action: {
    default_title: 'nochmos',
    default_popup: 'popup.html'
  },
  commands: {
    _execute_browser_action: {
      suggested_key: {
        default: 'Alt+Shift+P'
      }
    }
  },
  permissions: ['bookmarks', 'history', 'tabs', 'topSites']
};
