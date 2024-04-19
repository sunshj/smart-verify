const { GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX, defineConfig } = require('@sunshj/eslint-config')

module.exports = defineConfig([
  {
    files: [GLOB_TS, GLOB_TSX, GLOB_JS, GLOB_JSX]
  },
  {
    files: ['**/components/ui/*.tsx'],
    rules: {
      'react/prop-types': [2, { ignore: ['className'] }],
      'react-refresh/only-export-components': 'off'
    }
  }
])
