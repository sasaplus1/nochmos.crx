module.exports = function(context) {
  const isProduction = context.env === 'production';
  const isDevelopment = !isProduction;

  return {
    map: isDevelopment,
    plugins: {
      'postcss-preset-env': {
        features: {
          'nesting-rules': true
        }
      },
      'postcss-clean': isProduction
    }
  };
};
