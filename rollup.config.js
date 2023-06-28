const typescript = require('rollup-plugin-typescript2')
const { terser } = require('rollup-plugin-terser')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')

const pkg = require('./package.json')

const makeConfigForOutput = (output, plugins = []) => ({
  input: './lib/index.ts',
  output,
  plugins: [
    typescript(),
    terser({
      format: {
        comments: false,
        ecma: 5,
      },
    }),
    ...plugins,
  ],
})

module.exports = [
  makeConfigForOutput({
    file: pkg.main,
    format: 'umd',
    name: 'contentfulExtension',
    footer: 'globalThis.contentfulApp = globalThis.contentfulExtension;',
    globals: {
      'contentful-management': 'contentfulManagement',
    },
  }),
  makeConfigForOutput(
    {
      file: pkg.unpkg,
      format: 'umd',
      name: 'contentfulExtension',
      footer: 'globalThis.contentfulApp = globalThis.contentfulExtension;',
    },
    [nodeResolve({ browser: true }), commonjs()]
  ),
]
