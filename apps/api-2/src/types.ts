import { PrismaClient } from '@prisma/client';

export interface Context {
  prisma: PrismaClient;
}

// export interface ExampleInput {
//   name: string;
//   value: string;
// }