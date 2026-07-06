import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages 프로젝트 사이트는 /ethics-path-finder/ 하위에서 열리므로
  // 프로덕션 빌드에서만 base를 붙이고, 개발 서버는 루트(/)에서 실행한다.
  base: mode === "production" ? "/ethics-path-finder/" : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
