const typescript = require('rollup-plugin-typescript2')
const { terser } = require('rollup-plugin-terser')

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
