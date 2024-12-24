"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const ReceiptSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  amount: z.number(),
  createdat: z.string(),
  thumbnailurl: z.string().nullable(),
  fileurl: z.string().nullable(),
  category: z.string().nullable(),
  currency: z.string(),
  tags: z.array(z.string()).nullable(),
});

type Receipt = z.infer<typeof ReceiptSchema>;

export async function getReceipts(): Promise<Receipt[]> {
  const client = await createClient();
  const user = await client.auth.getUser();
  if (!user.data.user) return [];

  const { data, error } = await client
    .from("receipts")
    .select()
    .eq("user_id", user.data.user.id)
    .order("createdat", { ascending: false });

  return error ? [] : data.map((receipt) => ReceiptSchema.parse(receipt));
}

export async function getReceipt(id: number): Promise<Receipt | null> {
  const client = await createClient();
  const user = await client.auth.getUser();
  if (!user.data.user) return null;

  const { data, error } = await client
    .from("receipts")
    .select()
    .eq("user_id", user.data.user.id)
    .eq("id", id)
    .single();

  return error ? null : ReceiptSchema.parse(data);
}

export async function getCategories(): Promise<string[]> {
  const client = await createClient();
  const user = await client.auth.getUser();
  if (!user.data.user) return [];

  const { data, error } = await client
    .from("receipts")
    .select("category")
    .eq("user_id", user.data.user.id);

  return error ? [] : data.map((row) => row.category).filter(Boolean);
}

type UploadReceiptData = Omit<Receipt, "id">;

export async function createReceipt(
  receipt: UploadReceiptData
): Promise<Receipt | null> {
  const client = await createClient();
  const user = await client.auth.getUser();
  if (!user.data.user) return null;

  const { data, error } = await client
    .from("receipts")
    .insert({ ...receipt, user_id: user.data.user.id })
    .select();

  return error ? null : ReceiptSchema.parse(data[0]);
}

export type { Receipt, UploadReceiptData };
