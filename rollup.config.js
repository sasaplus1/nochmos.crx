import commonJs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: './src/popup.tsx',
    output: {
      file: './lib/popup.js',
      format: 'iife',
      name: 'popup',
      sourcemap: true
    },
    plugins: [typescript(), nodeResolve(), commonJs()]
  }
];
