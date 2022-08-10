// rollup.config.js
import babel from "rollup-plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";

import path from "path";

const customResolver = nodeResolve({
  extensions: [".mjs", ".js", ".jsx", ".json", ".sass", ".scss"],
});
const projectRootDir = path.resolve(__dirname);

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
    alias({
      entries: [
        {
          find: "@",
          replacement: path.resolve(projectRootDir, "src"),
          // OR place `customResolver` here. See explanation below.
        },
      ],
      customResolver,
    }),
    nodeResolve(),
    babel({
      exclude: "node_modules/**",
    }),
  ],
  external: [
    "lodash-es",
    "mitt",
    "axios",
    "leaflet",
    "leaflet/dist/leaflet.css",
    "leaflet.chinatmsproviders",
  ],
};
