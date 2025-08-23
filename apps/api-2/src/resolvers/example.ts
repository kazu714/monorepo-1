import { Context } from '../types';

export const exampleResolvers = {
  examples: async (_parent: any, _args: any, context: Context) => {
    const examples = await context.prisma.example.findMany({
      orderBy: { id: 'desc' },
    });
    
    return examples.map(example => ({
      ...example,
      createdAt: example.createdAt.toISOString(),
      updatedAt: example.updatedAt.toISOString(),
    }));
  },

  createExample: async (_parent: any, args: { name: string; value: string }, context: Context) => {
    const example = await context.prisma.example.create({
      data: {
        name: args.name,
        value: args.value,
      },
    });

    return {
      ...example,
      createdAt: example.createdAt.toISOString(),
      updatedAt: example.updatedAt.toISOString(),
    };
  },
};