"use client";

import { Badge } from "@/components/ui/badge";
import { Receipt } from "../actions/receipts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format-currency";
import { CalendarIcon, TagIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface ReceiptListProps {
  initialReceipts: Receipt[];
  categories: string[];
}

export function ReceiptList({ initialReceipts, categories }: ReceiptListProps) {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const categoryReceipts =
      category === "all"
        ? initialReceipts
        : initialReceipts.filter((r) => r.category === category);

    const filteredReceipts = categoryReceipts.filter((receipt) => {
      const q = search.trim().toLowerCase();
      return (
        receipt.title.toLowerCase().includes(q) ||
        receipt.description?.toLowerCase().includes(q) ||
        receipt.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
        receipt.category?.toLowerCase().includes(q)
      );
    });
    setReceipts(filteredReceipts);
  }, [initialReceipts, category, search]);

  if (initialReceipts.length == 0) return <></>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search receipts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {receipts.map((receipt) => (
          <Link href={`/receipt/${receipt.id}`} key={receipt.id}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div>
                  <Badge variant="secondary">
                    {receipt.category || "Uncategorized"}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold">
                  {receipt.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(receipt.amount, receipt.currency)}
                    </span>

                    <p className="text-sm text-muted-foreground mb-4">
                      {receipt.description}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(receipt.createdat).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <TagIcon className="w-4 h-4 text-muted-foreground" />
                      {receipt.tags?.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {receipt.thumbnailurl && (
                    <Image
                      src={receipt.thumbnailurl}
                      alt={receipt.title}
                      height={128}
                      width={128}
                      className="w-32 h-32 rounded-lg bg-gray-100 object-cover"
                    />
                  )}
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
