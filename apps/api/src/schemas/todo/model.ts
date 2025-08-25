import { builder } from '../../builder';

builder.prismaObject('Todo', {
  description: 'Todo item',
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    completed: t.exposeBoolean('completed'),
    createdAt: t.string({
      resolve: (todo) => todo.createdAt.toISOString(),
    }),
    updatedAt: t.string({
      resolve: (todo) => todo.updatedAt.toISOString(),
    }),
  }),
});