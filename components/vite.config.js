import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "components",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/components/Button.jsx",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: false,
        },
      },
    }),
    // {
    //   name: "vite-plugin-notify-host-on-rebuild",
    //   apply(config, { command }) {
    //     console.log("Vite command:", command);
    //     console.log("Vite config build watch:", JSON.stringify(config));
    //     return Boolean(
    //       command === "build" && config.build?.watch
    //     );
    //   },
    //   async buildEnd(err) {
    //     if (!err) {
    //       try {
    //         await fetch(
    //           "http://localhost:3000/__fullReload"
    //         );
    //         console.log("Notified host to reload.");
    //       } catch (error) {
    //         console.error("Failed to notify host:", error);
    //       }
    //     }
    //   },
    // },
  ],
  mode: "development",
  server: {
    port: 5001,
    cors: true,
  },
  preview: {
    port: 5001,
    cors: true,
  },
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        format: "esm",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
      },
    },
  },
});
