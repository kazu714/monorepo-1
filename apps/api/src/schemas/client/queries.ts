import { builder } from '../../builder'

builder.queryField('clients', (t) =>
  t.prismaField({
    type: ['Client'],
    resolve: async (query, _parent, _args, ctx) => {
      return ctx.prisma.client.findMany({
        ...query,
        orderBy: { id: 'desc' },
      });
    },
  }),
);