# 認証3層実装プロンプト (auth-impl.md)

## 目的
- Client ⇔ Web は **セッション（Cookie）**
- Web ⇔ API は **短命JWT（サービス間認証）**
- **強制ログアウト可能**で、**セキュアなセッション管理**ができるようにする

## todo
- [ ] Client ⇔ Web は **セッション（Cookie）**で、 Web ⇔ APIは認証なし
  - [x] ログイン
  - [ ] ログイン済みかの確認
  - [ ] ログアウト
- [ ] Web ⇔ API は **短命JWT（サービス間認証）**
  - [ ] jwt
  - [ ] graphqlにauthScope

## 説明

#フロー

- ログイン
  - ブラウザが`/login`で`メールアドレス`と`password`でログインのリクエストをwebサーバーに投げる
  - webサーバーの`/login`のactionで、apiサーバーにセッション作成リクエストを投げる
  - webサーバーはapiサーバーからのレスポンスでセッションを受け取る
  - webサーバーはcookieにセッションを格納し、ブラウザにレスポンスを返す
-


- Remix(Web)側でセッションを生成・検証・失効する仕組みを作成  
- Cookieは HttpOnly + Secure + SameSite  
- DB(MySQL + Prisma想定) にセッションテーブルを作成  
- 機能: `createSession(userId)`, `revokeSession(sessionId)`, `validateSession(sessionId)`

---

### 2. Web⇔API間のJWT発行

次の内容をTypeScriptコードで実装して。ファイルパスも明記すること。

- Web側がAPIを呼び出す際にJWTを発行  
- 鍵は RS256 (PRIVATE_KEY / PUBLIC_KEY)  
- JWTには `sub(userId)`, `sid(sessionId)`, `aud=api`, `iss=web`, `exp(60秒)` を含める  
- API呼び出し用のヘルパー関数 `callApi(request, {userId, sid})` を作成  

---

### 3. API側のJWT検証

次の内容をTypeScriptコードで実装して。ファイルパスも明記すること。

- ExpressミドルウェアとしてJWTを検証する処理を実装  
- JWTの署名・aud・iss・exp を検証  
- JWTに含まれる sid がセッションDBに存在し、有効かどうかを確認  
- 無効なら401を返す  

---

### 4. 強制ログアウトフロー
番号4番を実行して。

次の内容をTypeScriptコードで実装して。ファイルパスも明記すること。

- Web側で `/logout` エンドポイントを作成  
- Cookieを削除し、DBのセッションを revoke  
- API側は sid が無効になったJWTを拒否  

---

### 5. 結合テスト
番号5番を実行して。

次の内容をTypeScript/Jestコードで実装して。ファイルパスも明記すること。

- ログイン → API呼び出し成功  
- 強制ログアウト → API呼び出し失敗  
- JWT期限切れ → API呼び出し失敗  

---

## 実行方法の例
1. このmdファイルをAIに渡す  
2. 「番号1番を実行して」と指示 → Remixのセッションコード生成  
3. 続けて「番号2番を実行して」と指示 → JWT発行コード生成  
4. 同様に番号を進めていくことで、3層認証が完成する  
