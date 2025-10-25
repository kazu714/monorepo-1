import { builder } from '../../builder'

builder.mutationField('createClient', (t) =>
  t.prismaField({
    type: 'Client',
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      return ctx.prisma.client.create({
        ...query,
        data: {
          name: args.name,
        },
      });
    },
  }),
);