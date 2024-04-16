import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import federation from "@originjs/vite-plugin-federation";
import svgr from "vite-plugin-svgr";
import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";

// config_prefix environment
const ENV_PREFIX = [loadEnv("", process.cwd(), "ENV_").ENV_PREFIX];
process.env = { ...process.env, ...loadEnv("", process.cwd(), ENV_PREFIX) };

// https://vitejs.dev/config/
export default defineConfig({
  mode: "production",
  envPrefix: ENV_PREFIX,
  envDir: process.cwd(),
  plugins: [
    react(),
    svgr({
      include: "**/*.svg",
      exclude: "",
    }),
    federation({
      name: "MiniAppChatWithWorld",
      filename: "mini_app_chat_with_world.js",
      exposes: {
        "./MiniApp": "./src/bootstrap.tsx",
      },
      shared: [],
      // shared: ["react", "react-dom"],
    }),
  ],
  build: {
    cssMinify: true,
    modulePreload: false,
    target: "esnext",
    minify: true,
    cssCodeSplit: false,
    outDir: "dist",
    assetsDir: "",
    sourcemap: true,
    rollupOptions: {
      treeshake: "recommended",
      output: {
        chunkFileNames: `chunk-chat-with-world-mini-app.js`,
        entryFileNames: `chat-with-world-mini-app.js`,
        assetFileNames: `chat-with-world-mini-app.css`,
        minifyInternalExports: true,
        noConflict: true,
        validate: true,
        format: "esm",
      },
    },
    copyPublicDir: true,
    emptyOutDir: true,
  },
  publicDir: "public",
  clearScreen: true,
  appType: "spa",
  resolve: {
    alias: [
      { find: /^~/, replacement: "" },
      { find: "@", replacement: "/src" },
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        rootpath: process.env.CHAT_WITH_WORLD_HOST,
      },
    },
    postcss: {
      plugins: [autoprefixer({ supports: true }), postcssPresetEnv({})],
    },
  },
});
