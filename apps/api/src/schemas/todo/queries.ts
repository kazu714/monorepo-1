import { builder } from '../../builder';

builder.queryField('todos', (t) =>
  t.prismaField({
    type: ['Todo'],
    resolve: async (query, _parent, _args, ctx) => {
      return ctx.prisma.todo.findMany({
        ...query,
        orderBy: { id: 'desc' },
      });
    },
  }),
);

builder.queryField('todo', (t) =>
  t.prismaField({
    type: 'Todo',
    nullable: true,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      return ctx.prisma.todo.findUnique({
        ...query,
        where: { id: args.id },
      });
    },
  }),
);