import { ReceiptUploadForm } from "../components/receipt-upload-form";

export default function UploadReceiptPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Upload New Receipt</h1>
        <ReceiptUploadForm />
      </div>
    </div>
  );
}
