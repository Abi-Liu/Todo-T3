import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  createTodo: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.todo.create({
        data: {
          text: input.text,
          userId: ctx.session.user.id,
        },
      });
    }),

  getTodosByUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.todo.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.todo.delete({ where: { id: input.id } });
    }),

  updateComplete: protectedProcedure
    .input(z.object({ id: z.string(), complete: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.todo.update({
        where: { id: input.id },
        data: { completed: !input.complete },
      });
    }),
  updateTodo: protectedProcedure
    .input(z.object({ id: z.string(), text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.todo.update({
        where: { id: input.id },
        data: { text: input.text },
      });
    }),
});
