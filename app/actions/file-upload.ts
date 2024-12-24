import { createClient } from "@/lib/supabase/client";

export async function uploadFile(
  name: string,
  file: File
): Promise<string | null> {
  const client = await createClient();
  const user = await client.auth.getUser();
  if (!user.data.user) return null;

  const fileExt = file.name.split(".").pop();
  const filePath = `${user.data.user.id}/${name}-${
    Math.random() * 10
  }.${fileExt}`;

  const { error: uploadError } = await client.storage
    .from("receipts")
    .upload(filePath, file);

  if (uploadError) return null;

  return client.storage.from("receipts").getPublicUrl(filePath).data.publicUrl;
}
