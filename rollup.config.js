import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from "@rollup/plugin-typescript"
import {terser} from "rollup-plugin-terser"

import * as pkg from './package.json'


const makeConfigForOutput = (output) => ({
  input: './lib/index.ts',
  output,
  plugins: [
    typescript(),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs({extensions: ['.ts', '.js']}),
    terser({
      format: {
        comments: false,
        ecma: 5
      }
    })
  ]
})

export default [
  makeConfigForOutput({
    file: pkg.main,
    format: 'umd',
    name: 'contentfulExtension',
  }),
  makeConfigForOutput([
    {format: 'es', file: pkg.module},
  ])
]
