/**
 * razzle.config.js
 * Webpack overrides for the application.
 */
'use strict';

module.exports = {
  plugins: [
    {
      name: "typescript",
      options: {
        useBabel: true,
        useEslint: true,
        forkTsChecker: {
          tsconfig: "./tsconfig.json",
          tslint: undefined,
          watch: "./src",
          typeCheck: true,
        },
      },
    },
  ],
  rules: [
    {
      test: /\.svg$/,
      use: ['@svgr/webpack', 'file-loader']
    },
    {
      test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
      loader: 'file-loader',
    }
  ]
};
