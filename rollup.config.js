const typescript = require('rollup-plugin-typescript2')
const { terser } = require('rollup-plugin-terser')
const { nodeResolve } = require('@rollup/plugin-node-resolve')

const pkg = require('./package.json')

const makeConfigForOutput = output => ({
  input: './lib/index.ts',
  output,
  plugins: [
    typescript(),
    terser({
      format: {
        comments: false,
        ecma: 5
      }
    }),
  ],
  external: ['contentful-management']
})

module.exports = [
  makeConfigForOutput({
    file: pkg.main,
    format: 'umd',
    name: 'contentfulExtension',
    footer: 'globalThis.contentfulApp = globalThis.contentfulExtension;',
    plugins: [nodeResolve()],
  }),
]
