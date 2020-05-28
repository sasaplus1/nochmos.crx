import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: './src/popup.tsx',
    output: {
      file: './lib/popup.js',
      format: 'iife',
      name: 'popup',
      sourcemap: 'inline'
    },
    plugins: [
      alias({
        entries: [
          // NOTE: need for react-redux if use with preact
          // see: https://preactjs.com/guide/v10/upgrade-guide/#preact-redux
          { find: 'react', replacement: 'preact/compat' },
          { find: 'react-dom', replacement: 'preact/compat' }
        ]
      }),
      // NOTE: need for some modules
      // see: https://github.com/rollup/rollup/issues/2881
      // see: https://github.com/badcafe/rollup-plugin-inject-process-env#readme
      replace({
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        )
      }),
      typescript(),
      nodeResolve(),
      commonjs({
        namedExports: {
          // NOTE: need for react-redux if use with preact
          // see: https://stackoverflow.com/a/50098540
          'node_modules/react-is/index.js': [
            'isContextConsumer',
            'isValidElementType'
          ]
        }
      })
    ]
  },
  {
    input: './src/background.ts',
    output: {
      file: './lib/background.js',
      format: 'iife',
      name: 'background',
      sourcemap: 'inline'
    },
    plugins: [typescript(), nodeResolve(), commonjs()]
  },
  {
    input: './src/worker.ts',
    output: {
      file: './lib/worker.js',
      format: 'iife',
      name: 'worker',
      sourcemap: 'inline'
    },
    plugins: [typescript(), nodeResolve(), commonjs()]
  }
];
