
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import cjs from 'rollup-plugin-commonjs';

export default {
  input: './src/index.js',
  output: {
    file: './dist/vue-rout-authority.js',
    format: 'umd',
    name: 'vueRouterAuthority'
  },
  sourcemap: true,
  plugins: [
    resolve(),
    cjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
