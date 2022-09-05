import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {
  creatUserSchema,
  requestOtpSchema,
  verifyOtpSchema,
} from "../../schema/user.schema";
import { createRouter } from "../createRouter";
import * as trpc from "@trpc/server";
import { sendLoginEmail } from "../../utils/mailer";
import { BASE_URL, URL } from "../../constants";
import { decode, encode } from "../../utils/base64";
import { signJwt } from "../../utils/jwt";
import { serialize } from "cookie";

export const userRouter = createRouter()
  .mutation("register-user", {
    input: creatUserSchema,
    resolve: async ({ ctx, input }) => {
      const { email, name } = input;

      try {
        const user = await ctx.prisma.user.create({
          data: {
            email,
            name,
          },
        });
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .mutation("request-otp", {
    input: requestOtpSchema,
    resolve: async ({ input, ctx }) => {
      const { email, redirect } = input;

      const user = await ctx.prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      const token = await ctx.prisma.loginToken.create({
        data: { redirect, user: { connect: { id: user.id } } },
      });

      // send email to user
      await sendLoginEmail({
        email: user.email,
        token: encode(`${token.id}:${user.email}`),
        url: BASE_URL,
      });

      return true;
    },
  })
  .query("verify-otp", {
    input: verifyOtpSchema,
    resolve: async ({ input, ctx }) => {
      const decoded = decode(input.hash).split(":");

      const [id, email] = decoded;

      const token = await ctx.prisma.loginToken.findFirst({
        where: { id, user: { email } },
        include: { user: true },
      });
      if (!token) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Invalid token",
        });
      }

      const jwt = signJwt({ email: token.user.email, id: token.user.id });

      ctx.res.setHeader("Set-Cookie", serialize("token", jwt, { path: "/" }));

      return {
        redirect: token.redirect,
      };
    },
  })
  .query("me", {
    resolve: ({ ctx }) => ctx.user,
  });
