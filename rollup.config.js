// rollup.config.js
import babel from "rollup-plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
export default {
  input: "src/index.js",
  output: [
    {
      file: "lib/map-es.js",
      format: "es",
    },
    {
      file: "lib/map-cjs.js",
      format: "cjs",
      exports: "named",
    },
  ],
  plugins: [
    nodeResolve(),
    babel({
      exclude: "node_modules/**",
    }),
  ],
  external: ["lodash-es", "mitt", "axios"],
};
