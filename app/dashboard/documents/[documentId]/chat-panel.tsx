"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { QuestionForm } from "./question-form";

export default function ChatPanel({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const chats = useQuery(api.chats.getChatsForDocument, { documentId });

  return (
    <div className="border flex flex-col gap-2 p-6 justify-between">
      <div className="overflow-y-auto h-[350px] space-y-2">
        <div className="bg-white border dark:bg-gray-700/90 rounded p-3">
          AI : Ask any questions related to your pdf
        </div>

        {chats?.map((chat, _) => (
          <div
            className={`whitespace-pre-line border p-3 rounded-xl ${chat.isHuman ? "bg-slate-100 dark:bg-slate-700/50 text-right" : "bg-white dark:bg-gray-700/90"}`}
            key={_}
          >
            {chat.isHuman ? "YOU " : "AI "}
            {" : "} {chat.text}
          </div>
        ))}
      </div>

      <div className="flex gap-1">
        <QuestionForm documentId={documentId} />
      </div>
    </div>
  );
}
