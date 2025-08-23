import { builder } from '../../builder';

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