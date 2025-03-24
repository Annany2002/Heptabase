"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { QuestionForm } from "./question-form";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";

export default function ChatPanel({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const chats = useQuery(api.chats.getChatsForDocument, { documentId });

  return (
    <div className="border flex flex-col gap-2 p-6 justify-between">
      <div className="overflow-y-auto h-[calc(100vh-340px)] space-y-2">
        <div className="bg-white border dark:bg-gray-900/90 rounded p-3">
          AI : Ask any questions related to your pdf
        </div>

        {chats?.map((chat, _) => (
          <div
            className={`whitespace-pre-line border p-3 rounded-xl ${chat.isHuman ? "bg-slate-100 dark:bg-slate-900/50 text-right" : "bg-white dark:bg-gray-900/90"}`}
            key={_}
          >
            {chat.isHuman ? (
              <div className="flex justify-end">
                <p className="font-bold text-gray-500">
                  YOU :{" "}
                  <span className="font-medium text-gray-950 dark:text-white">
                    {chat.text}
                  </span>
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1 justify-start p-1 text-base">
                <p className="text-cyan-500">AI : </p>
                <ReactMarkdown>{chat.text}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-1">
        <QuestionForm documentId={documentId} />
      </div>
    </div>
  );
}
