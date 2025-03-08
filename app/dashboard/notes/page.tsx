"use client";

import Image from "next/image";

export default function NotesPage() {
  return (
    <main className="space-y-8 w-full mt-12  pb-12">
      <div className="flex flex-col ml-32  gap-4">
        <Image
          src="/undraw_choose-card_es1o.svg"
          alt="add-notes"
          width={300}
          height={300}
          priority
        />
        <h1 className="text-4xl font-bold">No notes selected yet</h1>
        <p className="text-gray-500">Select a note to get started.</p>
      </div>
    </main>
  );
}
