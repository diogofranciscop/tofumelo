const purgecss = require('@fullhuman/postcss-purgecss').default;

module.exports = {
  plugins: [
    purgecss({
      content: ['./_site/**/*.html', './assets/js/**/*.js'], // Scan HTML and JavaScript files
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      safelist: [
        'card', 'loading-card', 'spinner', 'pagination-button', 'pagination-ellipsis', 'active', // Add dynamic classes here
        /^card__/, // Safelist all classes starting with 'card__'
        /^pagination-/ // Safelist all classes starting with 'pagination-'
      ]
    })
  ]
};
