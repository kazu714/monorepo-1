import { builder } from "../../builder";

builder.queryField("user", (t) =>
  t.prismaField({
    type: "User",
    nullable: true,
    resolve: async (query, parent, args, context) => {
      return context.currentUser;
    },
  })
);
