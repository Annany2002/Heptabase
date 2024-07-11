"use client";

import { api } from "@/convex/_generated/api";
import { DocumentCard } from "./document-card";
import UploadDocumentButton from "./upload-document-button";
import { useQuery } from "convex/react";
import SkeletonCard from "./skeleton-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  const documents = useQuery(api.documents.getDocuments);

  return (
    <main className="p-24 space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-4xl">My Documents</h1>
        <UploadDocumentButton />
      </div>

      {documents === undefined && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {new Array(8).fill("").map((i, _) => (
            <div key={_}>
              <SkeletonCard />
            </div>
          ))}
        </div>
      )}

      {documents && documents.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <Card className="mt-10 w-[350px] flex flex-col gap-4 items-center justify-center">
            <CardHeader>
              <CardDescription className="text-lg">
                You haven&apos;t uploaded a document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src="./undraw_add_files_re_v09g.svg"
                alt="upload-in-empty"
                height="150"
                width="150"
              />
            </CardContent>
            <CardFooter>
              <UploadDocumentButton />
            </CardFooter>
          </Card>
        </div>
      )}

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
