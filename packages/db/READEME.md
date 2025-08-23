prismaでは下記の2つが使われる
- npm install @prisma/client
  - prismaでnode_modeluesに生成されたのから、アプリ実行中に`const prisma = new PrismaClient()`のようにDBとの接続を確立する
- npm install -D prisma
  - `pnpm generate`でschemaからnode_modelesにクライアントの型を生成する

つまり、packages/dbにはdevDependenciesにprismaのみでよい
ただ、apps/apiなどにもprismaは必要らしい。docker buildなどで単体でapiフォルダを動かしてimageを作るときに、prismaがapiにないとnode_modelesに作れない

## 設定
- outputのデフォルトを削除し`"prisma:gen": "prisma generate --schema ../../packages/db/prisma/schema.prisma"`を記述する
  - そしてturboでprisma:genを呼び出したらよい、そしたら各プロジェクトのnode_modulesに生成される
  - また、Prisma CLI には --dotenvオプションがあるので、（指定しなければ.prismaがあるディレクトリの.envが参照される）下記のようにする
    - `prisma generate --schema ./packages/db/prisma/schema.prisma --dotenv ./../../.env`
- output 未指定 → node_modules/@prisma/client に出る → import そのまま使える
  - 例　import { PrismaClient } from "@prisma/client";
- output を指定(デフォルト) → 任意のフォルダに出る → import パスを自分で書き換えないといけない
  - 例　import { PrismaClient } from "../../generated/prisma"

# コマンド
npm install @prisma/client
npm install -D prisma
npx prisma init --datasource-provider mysql
npx prisma migrate dev --name init
npx prisma generate