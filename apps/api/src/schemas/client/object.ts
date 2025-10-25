import {builder} from '../../builder'

builder.prismaObject('Client', {
  description: 'Client',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    createdAt: t.string({
      resolve: (client) => client.createdAt.toISOString(),
    }),
    updatedAt: t.string({ 
      resolve: (client) => client.updatedAt.toISOString(),
    }),
  }),
});