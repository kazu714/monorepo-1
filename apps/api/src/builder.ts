import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import type { Context } from "./context";
import { prisma } from "./context";
import { DateTimeResolver } from "graphql-scalars";

// Prismaプラグインを使用
export const builder = new SchemaBuilder<{
  Context: Context;
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
}>({
  plugins: [PrismaPlugin,SimpleObjectsPlugin],
  prisma: {
    client: prisma,
  },
});

// ルート型を作成（最低限必要）
builder.queryType({});
builder.mutationType({});

// スカラーを追加
builder.addScalarType("DateTime", DateTimeResolver, {});
