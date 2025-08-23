import { builder } from '../../builder';

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