module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
  plugins: {
    'postcss-preset-env': {
      features: {
        'nesting-rules': true
      }
    }
  }
};
