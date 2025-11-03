import { createCookieSessionStorage, redirect } from "react-router";
import { gql } from "graphql-request";
import { getGraphQLClient } from "./graphql";

// セッションストレージ設定
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "session", // Cookie名
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30日
    secrets: ["your-secret-here"], // TODO: 環境変数に移動
  },
});

// ヘルパー関数を展開
const { getSession, commitSession, destroySession } = sessionStorage;

// セッション情報の型定義
interface Session {
  sessionId: string;
}

// ログイン処理
export const login = async (
  email: string,
  password: string,
  request: Request
) => {
  const graphqlClient = await getGraphQLClient(request);
  console.log("webのlogin関数が呼ばれました")
  try {
    const CREATE_SESSION_MUTATION = gql`
      mutation CreateSession($input: LoginInput!) {
        createSession(input: $input) {
          token
        }
      }
    `;

    const { createSession } = (await graphqlClient.request(CREATE_SESSION_MUTATION, {
      input: { email, password },
    })) as any;

    console.log("取得したセッション情報:", createSession);

    // 現在のリクエストからセッションを取得
    const cookie = await getSession(request.headers.get("Cookie"));

    // cookieに token を保存
    cookie.set("token", createSession.token);
    // Cookie付きレスポンスを返す
    return redirect("/todos", {
      headers: {
        "Set-Cookie": await commitSession(cookie),
      },
    });
  } catch (error) {
    console.error("ログインエラー", error);
    throw new Error("ログインに失敗しました");
  }
};

// セッションIDを取得
export const getToken = async (
  request: Request
): Promise<string | null> => {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("token") || null;
};

// ログアウト処理
export const logout = async (request: Request) => {
  const graphqlClient = await getGraphQLClient(request);
  const session = await getSession(request.headers.get("Cookie"));

  const deleteSessionMutation = gql`
    mutation DeleteSession($sessionId: String!) {
      deleteSession(sessionId: $sessionId)
    }
  `;

  await graphqlClient.request(deleteSessionMutation, {
    sessionId: session.get("sessionId"),
  });

  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

// 認証が必要なページでの認証チェック
export const ensureSession = async (request: Request) => {
  console.log("ensureSessionが呼ばれました");
  const graphqlClient = await getGraphQLClient(request);
  const token = await getToken(request);

  if (!token) {
    throw redirect("/login");
  }
  console.log("session queryを実行します");
  const SESSION_QUERY = gql`
    query GetUser {
      user{
        id
      }
    }
  `;


  const { user } = (await graphqlClient.request(SESSION_QUERY)) as any;
  console.log("取得したユーザー情報:", user);

  if (!user) {
    throw redirect("/login");
  }
  return { user };
};
