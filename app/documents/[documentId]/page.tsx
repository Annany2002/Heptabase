"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import ChatPanel from "./chat-panel";
import { Loader, Loader2Icon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <div className="flex items-center w-full h-[calc(100dvh-72px)] justify-center">
        <Loader2Icon className="animate-spin" size={42} />
      </div>
    );
  }

  return (
    <main className="space-y-8 p-24">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">{document.title}</h1>
      </div>
      <div className="flex gap-12">
        <Tabs defaultValue="document" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="document">
            <div className="border p-4 bg-gray-800 rounded-xl flex-1 h-[500px]">
              {document.documentUrl && (
                <iframe className="w-full h-full" src={document.documentUrl} />
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
