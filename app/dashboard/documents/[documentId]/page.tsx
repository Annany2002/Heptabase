"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import ChatPanel from "./chat-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteDocumentButton from "./delete-document-button";

export default function DocumentPage({
  params,
}: {
  params: { documentId: Id<"documents"> };
}) {
  const document = useQuery(api.documents.getDocument, {
    documentId: params.documentId,
  });

  if (!document) {
    return (
      <div className="flex flex-col gap-5 items-start px-12 w-full h-[calc(100dvh-72px)] justify-center">
        <Skeleton className="h-16 w-1/2" />
        <div className="flex flex-col space-y-3 w-3/4">
          <Skeleton className="h-[300px] w-full rounded-md" />
        </div>
        <Skeleton className="h-16 w-1/2" />
      </div>
    );
  }

  return (
    <main className="space-y-8 w-full pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">{document.title}</h1>

        <DeleteDocumentButton documentId={document._id} />
      </div>
      <div className="flex gap-12">
        <Tabs defaultValue="document" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="document">
            <div className="border p-4 rounded-xl flex-1 h-[500px]">
              {document.documentUrl && (
                <iframe
                  className="w-full text-black h-full"
                  src={document.documentUrl}
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="chat">
            {" "}
            <ChatPanel documentId={document._id} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
