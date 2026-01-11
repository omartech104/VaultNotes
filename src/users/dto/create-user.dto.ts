import { z } from 'zod';

export const CreateUserSchema = z.object({
  username: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// This helps TypeScript know the shape of the data
export type CreateUserDto = z.infer<typeof CreateUserSchema>;