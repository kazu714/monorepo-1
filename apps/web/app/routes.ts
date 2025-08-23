import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// @react-router/fs-routesを使うと、remixのファイルベースルーティングを使えるようになる。
export default flatRoutes() satisfies RouteConfig;