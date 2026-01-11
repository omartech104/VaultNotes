import z from "zod";

export const CreateNoteSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
});
export type CreateNoteDto = z.infer<typeof CreateNoteSchema>;

export const UpdateNoteSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
});
export type UpdateNoteDto = z.infer<typeof UpdateNoteSchema>;