import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';

const env = process.env.NODE_ENV || 'production';
const prod = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 8080;

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: false,
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    nodeResolve(),
    commonjs(),
    postcss({
      extract: true,
      minimize: prod,
      sourcemap: false,
    }),
    typescript(),
    html(),
    prod && terser(),
    !prod &&
      serve({
        contentBase: 'dist',
        port,
      }),
  ],
};
