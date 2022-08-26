// rollup.config.js
import babel from "rollup-plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import { terser } from "rollup-plugin-terser";
import scss from "rollup-plugin-scss";
import dartSass from "sass";

import path from "path";

const customResolver = nodeResolve({
  extensions: [".mjs", ".js", ".jsx", ".json", ".sass", ".scss"],
});
const projectRootDir = path.resolve(__dirname);

export default {
  input: "src/index.js",
  output: [
    {
      file: "lib/leaflet-map-es.js",
      format: "es",
    },
    {
      file: "lib/leaflet-map-cjs.js",
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
    scss({ include: /\.scss$/, sass: dartSass }),
    nodeResolve(),
    babel({
      exclude: "node_modules/**",
    }),
    terser(),
  ],
  external: [
    "lodash-es",
    "mitt",
    "axios",
    "nanoid",
    "leaflet",
    "leaflet/dist/leaflet.css",
    "leaflet-draw",
    "leaflet-draw/dist/leaflet.draw-src.css",
    "leaflet.chinatmsproviders",
    "proj4",
    "proj4leaflet",
  ],
};
