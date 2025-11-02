import { GraphQLClient } from 'graphql-request';

const API_URL = 'http://localhost:4000/graphql';

// 下記だと、リクエストヘッダーにセッションIDを含められない。ブラウザのリクエスト毎に生成する必要がある。
// なぜなら、ブラウザのリクエストヘッダーからセッションIDを取得して、GraphQLClientのヘッダーにセットする必要があるから。
// export const graphqlClient = new GraphQLClient(API_URL);

export const getGraphQLClient = (browserReq: Request) => {
  return new GraphQLClient(API_URL, {
    requestMiddleware: (initRequest) => {
      const sessionId = browserReq.headers.get('sessionId');

      const headers = new Headers(initRequest.headers);
      headers.append('authorization', `Bearer ${sessionId}`);

      return {
        ...initRequest,
        headers,
      };
    }
  });
}