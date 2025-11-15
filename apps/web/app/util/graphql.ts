import { GraphQLClient } from "graphql-request";

const API_URL = "http://localhost:4000/graphql";

export const getGraphQLClient = (browserReq: Request) => {
  return new GraphQLClient(API_URL, {
    requestMiddleware: (initRequest) => {
      // Cookieからsessionを抽出
      const cookieHeader = browserReq.headers.get("cookie");
      const match = cookieHeader?.match(/session=([^;]+)/);
      // このsessionはreactRouterで作られたsession
      const session = match ? decodeURIComponent(match[1]) : null;

      const headers = new Headers(initRequest.headers);

      if (session) {
        // . の前の部分をBase64デコードしてJSONに変換
        const [encodedPart] = session!.split(".");

        const tokenString = Buffer.from(encodedPart, "base64").toString("utf8");
        const token = JSON.parse(tokenString).token;

        if (token) {
          headers.append("authorization", `Bearer ${token}`);
        }
      }

      return {
        ...initRequest,
        headers,
      };
    },
  });
};
