import z from "zod";

export const creatUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export type CreateUserInput = z.TypeOf<typeof creatUserSchema>;

export const loginUserSchema = z.object({
  email: z.string().email(),
});

export type LoginUserInput = z.TypeOf<typeof loginUserSchema>;

// export const createUserOutputSchema = z.object({})

export const requestOtpSchema = z.object({
  email: z.string().email(),
  redirect: z.string().default("/"),
});

export type RequestOtpInput = z.TypeOf<typeof requestOtpSchema>;

export const verifyOtpSchema = z.object({
  hash: z.string(),
});
