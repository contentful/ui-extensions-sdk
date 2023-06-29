const typescript = require('rollup-plugin-typescript2')
const { terser } = require('rollup-plugin-terser')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')

const pkg = require('./package.json')

const defaultPlugins = [
  typescript(),
  terser({
    format: {
      comments: false,
      ecma: 5,
    },
  }),
]

module.exports = [
  {
    input: './lib/index.ts',
    output: {
      file: pkg.main,
      format: 'umd',
      name: 'contentfulExtension',
      footer: 'globalThis.contentfulApp = globalThis.contentfulExtension;',
    },
    external: ['contentful-management'],
    plugins: defaultPlugins,
  },
  {
    input: './lib/index.ts',
    output: {
      file: pkg.unpkg,
      format: 'umd',
      name: 'contentfulExtension',
      footer: 'globalThis.contentfulApp = globalThis.contentfulExtension;',
    },
    plugins: [...defaultPlugins, nodeResolve({ browser: true }), commonjs()],
  },
]
