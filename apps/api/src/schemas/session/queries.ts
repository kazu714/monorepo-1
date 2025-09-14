import {builder } from '../../builder';

builder.queryField('session', (t) =>
  t.prismaField({
    type: 'Session',
    nullable: true,
    args: {
      id: t.arg.string({ required: true })
    },
    resolve: async (query, root, args, context) => {
      return context.prisma.session.findUnique({
        ...query,
        where: { 
          id: args.id,
          expiresAt: { gte: new Date() },
         }
      });
    }
  })
);