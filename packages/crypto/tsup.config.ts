import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  shims: true,
});
