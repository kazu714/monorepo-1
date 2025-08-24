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

## コードスタイル

- 共通
  - 可能な限り分割代入を活用
  - 関数名は snake_case、クラス名は PascalCase で統一
  - solid原則に基づく
  - TypeScriptの型安全性を最大限活用
- web
  - ファイルベースルーティングを使用(Flat Routes + Route Segments)
- api
  - スキーマファーストでPothosを使用

