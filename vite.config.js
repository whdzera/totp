import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: "app/javascript",
  base: "/",
  build: {
    outDir: "../../app/build",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        application: path.resolve(__dirname, "app/javascript/application.js"),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
