import { builder } from '../../builder';

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