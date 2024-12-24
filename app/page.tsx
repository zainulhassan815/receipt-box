import { ReceiptList } from "./components/receipts-list";
import { getCategories, getReceipts } from "./actions/receipts";
import { ExpenseChart } from "./components/expense-chart";
import { ExpenseSummary } from "./components/expense-summary";
import { ReceiptUploadButton } from "./components/receipt-upload-button";
import { Button } from "@/components/ui/button";
import { logout } from "./actions/auth";

export default async function Page() {
  const receipts = await getReceipts();
  const categories = await getCategories();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-6">Your Receipts Dashboard</h1>
        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </div>
      <div className="space-y-8">
        <ExpenseSummary receipts={receipts} />
        <ExpenseChart receipts={receipts} />
        <ReceiptList initialReceipts={receipts} categories={categories} />
      </div>
      <ReceiptUploadButton />
    </div>
  );
}
