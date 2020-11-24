const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
const { terser } = require('rollup-plugin-terser')

const pkg = require('./package.json')

const makeConfigForOutput = output => ({
  input: './lib/index.ts',
  output,
  plugins: [
    typescript({
      exclude: ['test/**']
    }),
    nodeResolve(),
    commonjs({ extensions: ['.ts', '.js'] }),
    terser({
      format: {
        comments: false,
        ecma: 5
      }
    })
  ]
})

module.exports = [
  makeConfigForOutput({
    file: pkg.main,
    format: 'umd',
    name: 'contentfulExtension'
  })
]
