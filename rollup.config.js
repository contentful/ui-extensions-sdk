const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
const { terser } = require('rollup-plugin-terser')

const pkg = require('./package.json')

const makeConfigForOutput = output => ({
  input: './lib/index.ts',
  output,
  plugins: [
    typescript(),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
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
  }),
  makeConfigForOutput([{ format: 'es', file: pkg.module }])
]
