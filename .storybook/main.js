module.exports = {
  addons: [
    '@storybook/preset-typescript',
    '@storybook/addon-actions/register',
    '@storybook/addon-knobs/register'
  ],
  stories: ['../src/**/*.stories.[tj]s?(x)']
};
