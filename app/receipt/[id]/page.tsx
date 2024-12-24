import { getReceipt } from "../../actions/receipts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, TagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/format-currency";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const receipt = await getReceipt(parseInt(id));

  if (!receipt) {
    return <div>Receipt not found</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Link href="/">
        <Button variant="outline" className="mb-4">
          &larr; Back to Dashboard
        </Button>
      </Link>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div>
            <Badge variant="secondary" className="text-lg">
              {receipt.category || "Uncategorized"}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold">{receipt.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(receipt.amount, receipt.currency)}
            </span>
          </div>
          <p className="text-lg text-muted-foreground">{receipt.description}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>{new Date(receipt.createdat).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TagIcon className="w-4 h-4 text-muted-foreground" />
            {receipt.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          {receipt.fileurl && (
            <div className="mt-4">
              <a
                href={receipt.fileurl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Full Receipt
              </a>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {receipt.thumbnailurl && (
            <div className="w-80 h-80 relative overflow-hidden rounded-md">
              <Image
                src={receipt.thumbnailurl}
                alt={receipt.title}
                layout="fill"
              />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
