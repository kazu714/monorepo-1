

# トラブルシューティング
- queryやmutationを追加したのに、graphiqlにでてこない
  - schema/index.tsにimport文を追加する
  - node_modules再インストールと、pnpm devとpnpm generateしたらなぜか出てきたことはあった