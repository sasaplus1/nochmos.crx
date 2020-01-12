import commonJs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const config = [];

config.push({
  input: './src/popup.ts',
  output: {
    file: './lib/popup.js',
    format: 'iife',
    name: 'popup',
    sourcemap: true
  },
  plugins: [typescript(), nodeResolve(), commonJs()]
});

export default config;
