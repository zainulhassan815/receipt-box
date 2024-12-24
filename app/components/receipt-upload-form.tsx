"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadFile } from "../actions/file-upload";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { createReceipt, UploadReceiptData } from "../actions/receipts";
import { useRouter } from "next/navigation";

const UploadReceiptFormSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  amount: z.number(),
  file: z.instanceof(File),
  category: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  date: z.date(),
});

export function ReceiptUploadForm() {
  const [loading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const router = useRouter();

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags((prevTags) => [...prevTags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const validatedFields = UploadReceiptFormSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      amount: parseFloat(formData.get("amount") as string),
      file,
      category: formData.get("category"),
      tags,
      date: new Date(formData.get("date") as string),
    });

    if (validatedFields.success) {
      const fileName = validatedFields.data.title
        .trim()
        .toLowerCase()
        .split(" ")
        .join("-");
      const fileUrl = await uploadFile(fileName, file!);
      if (!fileUrl) return;

      const receiptData: UploadReceiptData = {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        amount: validatedFields.data.amount,
        fileurl: fileUrl,
        category: validatedFields.data.category,
        tags: validatedFields.data.tags,
        createdat: validatedFields.data.date.toISOString().split("T")[0],
        thumbnailurl: fileUrl,
        currency: "PKR",
      };
      await createReceipt(receiptData);
      router.push("/");
    }
    setIsLoading(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input id="amount" name="amount" type="number" step="0.01" required />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select name="category">
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="transportation">Transportation</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" />
      </div>
      <div>
        <Label htmlFor="tags">Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-sm">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-xs"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
        <Input
          id="tags"
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tags (press Enter to add)"
        />
      </div>
      <div>
        <Label htmlFor="receipt">Receipt Image</Label>
        <Input
          id="receipt"
          name="receipt"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
      </div>
      <Button disabled={loading} type="submit" className="w-full">
        Upload Receipt
      </Button>
    </form>
  );
}
