import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function ReceiptUploadButton() {
  return (
    <Button
      asChild
      className="fixed bottom-12 right-12 rounded-full h-16 shadow-xl px-8 font-bold text-md"
    >
      <Link href="/upload-receipt">
        <Plus className="h-6 w-6" /> Upload Receipt
      </Link>
    </Button>
  );
}
