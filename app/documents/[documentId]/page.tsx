"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export default function DocumentPage({
  params,
}: {
  params: { documentId: Id<"documents"> };
}) {
  const document = useQuery(api.documents.getDocument, {
    documentId: params.documentId,
  });

  if (!document) {
    return <h1 className="text-red-600">Unauthorized</h1>;
  }

  return (
    <main className="space-y-8 p-24">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">{document.title}</h1>
      </div>
      <div className="flex gap-12">
        <div className="border p-4 rounded flex-1 h-[600px]">
          {document.documentUrl && (
            <iframe className="w-full h-full" src={document.documentUrl} />
          )}
        </div>
        <div className="w-[300px] border"></div>
      </div>
    </main>
  );
}
