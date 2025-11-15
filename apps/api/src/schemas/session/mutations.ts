import { builder } from "../../builder";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

const LoginInput = builder.inputType("LoginInput", {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
  }),
});

const AuthPayload = builder.simpleObject("AuthPayload", {
  fields: (t) => ({
    token: t.string(),
  }),
});

builder.mutationField("createSession", (t) =>
  t.field({
    type: AuthPayload,
    args: {
      input: t.arg({ type: LoginInput, required: true }),
    },
    resolve: async (parent, { input }, { prisma }) => {
      const { email, password } = input;

      // ユーザーを検索
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // パスワード検証
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw new Error("Invalid email or password");
      }

      // セッション作成
      const sessionId = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30日後

      // セッションをdbに保存
      await prisma.session.create({
        data: {
          id: sessionId,
          userId: user.id,
          expiresAt,
        },
      });

      // jwtを作成 （現時点ではsessionidのみをペイロードに含める）
      const payload = { sessionId: sessionId };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

      return {
        token,
      };
    },
  })
);

builder.mutationField("deleteSession", (t) =>
  t.field({
    type: "Boolean",
    resolve: async (parent, arg, { prisma,currentUser}) => {
      const result = await prisma.session.deleteMany({
        where: { id: currentUser.sessionId },
      });
      return result.count > 0;
    },
  })
);
