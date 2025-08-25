import { builder } from '../../builder';

builder.mutationField('createTodo', (t) =>
  t.prismaField({
    type: 'Todo',
    args: {
      title: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      return ctx.prisma.todo.create({
        ...query,
        data: { title: args.title! },
      });
    },
  }),
);

builder.mutationField('updateTodo', (t) =>
  t.prismaField({
    type: 'Todo',
    args: {
      id: t.arg.int({ required: true }),
      title: t.arg.string(),
      completed: t.arg.boolean(),
    },
    resolve: async (query, _parent, args, ctx) => {
      const update_data: { title?: string; completed?: boolean } = {};
      if (args.title !== undefined) {
        update_data.title = args.title;
      }
      if (args.completed !== undefined) {
        update_data.completed = args.completed;
      }

      return ctx.prisma.todo.update({
        ...query,
        where: { id: args.id },
        data: update_data,
      });
    },
  }),
);

builder.mutationField('deleteTodo', (t) =>
  t.prismaField({
    type: 'Todo',
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      return ctx.prisma.todo.delete({
        ...query,
        where: { id: args.id },
      });
    },
  }),
);