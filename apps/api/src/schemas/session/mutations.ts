import { builder } from '../../builder';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const LoginInput = builder.inputType('LoginInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true })
  })
});

const AuthPayload = builder.simpleObject('AuthPayload', {
  fields: (t) => ({
    sessionId: t.string()
  })
});

builder.mutationField('createSession', (t) =>
  t.field({
    type: AuthPayload,
    args: {
      input: t.arg({ type: LoginInput, required: true })
    },
    resolve: async (parent, { input }, { prisma }) => {
      const { email, password } = input;

      // ユーザーを検索
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // パスワード検証
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // セッション作成
      const sessionId = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30日後

      const session = await prisma.session.create({
        data: {
          id: sessionId,
          userId: user.id,
          expiresAt
        }
      });

      return {
        sessionId: session.id
      };
    }
  })
);