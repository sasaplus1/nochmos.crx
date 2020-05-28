module.exports = {
  manifest_version: 2,
  name: 'nochmos',
  version: '0.0.0',
  description: 'fuzzy find from some sources',
  icons: {
    '16': 'icon_32.png',
    '48': 'icon_32.png',
    '128': 'icon_32.png'
  },
  background: {
    persistent: false,
    scripts: ['background.js']
  },
  browser_action: {
    default_icon: {
      '16': 'icon_32.png',
      '24': 'icon_32.png',
      '32': 'icon_32.png'
    },
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
