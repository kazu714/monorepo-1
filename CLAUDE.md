# claude codeへの指示
- 回答やtodoリスト等は全て日本語にしてください

# プロジェクト基本情報

## アーキテクチャ
このプロジェクトはpnpm workspaceによるモノレポ構成です。

### 技術スタック
- **Frontend (web)**: React + React Router v7
- **Backend (api)**: Node.js + GraphQL + Pothos + GraphQL Yoga
- **ORM**: Prisma
- **Database**: MySQL
- **Package Manager**: pnpm
- **Build Tool**: Turbo

### ディレクトリ構成
```
monorepo-1/
├── apps/
│   ├── web/           # React Router v7 フロントエンド
│   ├── api/           # GraphQL API (メイン)
│   └── api-2/         # 別のAPI実装（実験用）
├── packages/
│   └── db/            # Prisma スキーマとマイグレーション
└── .env               # 環境変数（DATABASE_URLなど）
```



## 共通コマンド

- `pnpm dev` : モノレポのプロジェクトの開発サーバーの並列実行
- `pnpm generate` : モノレポのgenerate系を一括実行（prisma generateなど）
- `cd C:\Users\user\programing\monorepo-1\packages\db && pnpm migrate:dev`：prismaマイグレーションを実行

## コードスタイル

- 共通
  - 可能な限り分割代入を活用
  - 関数名は snake_case、クラス名は PascalCase で統一
  - solid原則に基づく
  - TypeScriptの型安全性を最大限活用
- web
  - ファイルベースルーティングを使用する
  - フォルダ名が URL パスを表す（例: `routes/_auth.todo/route.tsx` → `/todo`）
  - 各ルートの `route.tsx` は、そのパスに対応するコンポーネントとハンドラ（loader, action 等）を定義するファイルである
  - フォルダ名ルール:
    1. フォルダ名の先頭に `_` が付く場合 → その部分は URL パスには表示されないが、ルートは実行される（例: `_auth`）
    2. フォルダ名の末尾に `_` が付く場合 → その部分は URL パスには表示されず、ルートも実行されない（ただしネスト構造上は存在する）
  - 例: `routes/_auth.todo_.create/route.tsx`
    - パスは `/todo/create` となる
    - `_auth` は実行される（認証処理など）
    - `todo` は実行されない
    - `create` が最終ルートとして実行される
- api
  - スキーマファーストでPothosを使用

