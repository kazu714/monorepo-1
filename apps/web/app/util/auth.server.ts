import { createCookieSessionStorage, redirect } from "react-router";
import { gql } from "graphql-request";
import { graphqlClient } from "./graphql";

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
  try {
    const CREATE_SESSION_MUTATION = gql`
      mutation CreateSession($input: LoginInput!) {
        createSession(input: $input) {
          sessionId
        }
      }
    `;

    const response = (await graphqlClient.request(CREATE_SESSION_MUTATION, {
      input: { email, password },
    })) as any;
    const { createSession } = response;

    // 現在のリクエストからセッションを取得
    const session = await getSession(request.headers.get("Cookie"));

    // セッションに sessionId を保存
    session.set("sessionId", createSession.sessionId);
    // Cookie付きレスポンスを返す
    return redirect("/todos", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error("ログインエラー", error);
    throw new Error("ログインに失敗しました");
  }
};

// セッションIDを取得
export const getSessionId = async (
  request: Request
): Promise<string | null> => {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("sessionId") || null;
};

// ログアウト処理
export const logout = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

// 認証が必要なページでの認証チェック
export const ensureSession = async (request: Request) => {
  const sessionId = await getSessionId(request);

  if (!sessionId) {
    throw redirect("/login");
  }

  const SESSION_QUERY = gql`
    query GetSession($id: String!) {
      session(id: $id) {
        id
        user {
          id
          email
        }        
        expiresAt
      }
    }
  `;

  const { session } = (await graphqlClient.request(SESSION_QUERY, {
    id: sessionId,
  })) as any;

  if (!session) {
    throw redirect("/login");
  }
  return { session };
};
