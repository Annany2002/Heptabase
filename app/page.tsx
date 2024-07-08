"use client";

import { api } from "@/convex/_generated/api";
import { DocumentCard } from "./document-card";
import UploadDocumentButton from "./upload-document-button";
import { useQuery } from "convex/react";

export default function Home() {
  const documents = useQuery(api.documents.getDocuments);

  return (
    <main className="p-24 space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-4xl">My Documents</h1>
        <UploadDocumentButton />
      </div>

      <div className="grid grid-cols-4 gap-8">
        {documents?.map((doc) => (
          <div key={doc._id}>
            <DocumentCard document={doc} />
          </div>
        ))}
      </div>
    </main>
  );
}
