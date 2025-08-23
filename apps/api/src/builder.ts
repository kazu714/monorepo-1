import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import type { Context } from './context';
import { prisma } from './context'; 

// Prismaプラグインを使用
export const builder = new SchemaBuilder<{
  Context: Context;
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

// ルート型を作成（最低限必要）
builder.queryType({});
builder.mutationType({});