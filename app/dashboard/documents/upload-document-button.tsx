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
import { FileUp } from "lucide-react";

export default function UploadDocumentButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1 px-3">
          <FileUp />
          Upload
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
