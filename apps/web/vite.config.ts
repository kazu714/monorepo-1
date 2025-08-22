import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  //   Vite でモノレポや複数依存を組むと、こんなことが起こりがちです👇
  // apps/web が react を依存に持っている
  // 別のライブラリ（例えば UI コンポーネントパッケージ）が内部でも react を依存に持っている
  // すると Vite の解決次第では node_modules/react が複数読み込まれ、別インスタンスが混在してしまう
  // これが起きると、
  // Invalid hook call エラー
  // Context API が共有されない
  // useState や useEffect の動作が破綻
  // といった不具合につながります。
  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
