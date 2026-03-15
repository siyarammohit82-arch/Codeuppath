import { build } from "esbuild";

await build({
  entryPoints: ["api/_entry.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: "api/index.js",
  packages: "external",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  logLevel: "info",
});
