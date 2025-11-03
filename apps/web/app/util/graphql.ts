import { GraphQLClient } from "graphql-request";

const API_URL = "http://localhost:4000/graphql";

// 下記だと、リクエストヘッダーにセッションIDを含められない。ブラウザのリクエスト毎に生成する必要がある。
// なぜなら、ブラウザのリクエストヘッダーからセッションIDを取得して、GraphQLClientのヘッダーにセットする必要があるから。
// export const graphqlClient = new GraphQLClient(API_URL);

// export const getGraphQLClient = (browserReq: Request) => {
//   return new GraphQLClient(API_URL, {
//     requestMiddleware: (initRequest) => {
//       const cookieHeader = browserReq.headers.get("cookie");
//       const match = cookieHeader?.match(/session=([^;]+)/);
//       console.log("match:", match);
//       const session = match ? match[1] : null;
//       console.log("burrowserReq.headers:", browserReq.headers);
//       console.log("取得したセッションID:", session);

//       // sessionから.の前を取り出して、decodeしてsessionIdを取得
//       const sessionId = session;

//       const headers = new Headers(initRequest.headers);

//       headers.append("authorization", `Bearer ${sessionId}`);

//       console.log("GraphQLClientのリクエストヘッダー:", headers);

//       return {
//         ...initRequest,
//         headers,
//       };
//     },
//   });
// };

// export const getGraphQLClient = (browserReq: Request) => {
//   return new GraphQLClient(API_URL, {
//     requestMiddleware: (initRequest) => {
//       // Cookieからsessionを抽出
//       const cookieHeader = browserReq.headers.get("cookie");
//       const match = cookieHeader?.match(/session=([^;]+)/);
//       // このsessionはreactRouterで作られたsession
//       const session = match ? decodeURIComponent(match[1]) : null;
//       console.log("取得したsession文字列:", session);

//       let sessionId: string | null = null;

//       if (session) {
//         try {
//           // . の前の部分をBase64デコードしてJSONに変換
//           const [encodedPart] = session.split(".");
//           const json = atob(encodedPart);
//           const data = JSON.parse(json);
//           sessionId = data.sessionId;
//           console.log("抽出したsessionId:", sessionId);
//         } catch (e) {
//           console.error("sessionデコード失敗:", e);
//         }
//       }

//       const headers = new Headers(initRequest.headers);
//       if (sessionId) {
//         headers.append("authorization", `Bearer ${sessionId}`);
//       }

//       console.log("GraphQLClientリクエストヘッダー:", Object.fromEntries(headers.entries()));

//       return {
//         ...initRequest,
//         headers,
//       };
//     },
//   });
// };

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

        console.log("デコードしたtoken:", token);

        if (token) {
          headers.append("authorization", `Bearer ${token}`);
        }
      }

      console.log(
        "GraphQLClientリクエストヘッダー:",
        Object.fromEntries(headers.entries())
      );

      return {
        ...initRequest,
        headers,
      };
    },
  });
};
