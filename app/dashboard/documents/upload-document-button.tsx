"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UploadDocumentForm from "../documents/upload-document-form";
import { useState } from "react";
import { Upload } from "lucide-react";

export default function UploadDocumentButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Upload className="w-5 g-5" /> Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a Document</DialogTitle>
          <DialogDescription>
            Upload know your document secrets
          </DialogDescription>
        </DialogHeader>
        <UploadDocumentForm onUpload={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
