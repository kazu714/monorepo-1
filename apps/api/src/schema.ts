import { builder } from './builder';

// Prismaプラグインを使用してExampleモデルを定義
builder.prismaObject('Example', {
  description: 'Example row',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    value: t.exposeString('value'),
    createdAt: t.string({
      resolve: (example) => example.createdAt.toISOString(),
    }),
    updatedAt: t.string({
      resolve: (example) => example.updatedAt.toISOString(),
    }),
  }),
});

// Query: 一覧
builder.queryField('examples', (t) =>
  t.prismaField({
    type: ['Example'],
    resolve: async (query, _parent, _args, ctx) => {
      return ctx.prisma.example.findMany({
        ...query,
        orderBy: { id: 'desc' },
      });
    },
  }),
);

// Mutation: 追加（value は Prisma 側で必須 → GraphQL でも必須にする）
builder.mutationField('createExample', (t) =>
  t.prismaField({
    type: 'Example',
    args: {
      name: t.arg.string({ required: true }),
      value: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      return ctx.prisma.example.create({
        ...query,
        data: { name: args.name!, value: args.value! },
      });
    },
  }),
);

export const schema = builder.toSchema({});
