"use client";

import { api } from "@/convex/_generated/api";
import { DocumentCard } from "./document-card";
import UploadDocumentButton from "./upload-document-button";
import { Unauthenticated, useQuery } from "convex/react";
import SkeletonCard from "../../skeleton-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";

export default function Home() {
  const documents = useQuery(api.documents.getDocuments);

  return (
    <main className="space-y-8 w-full px-6">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl">My Documents</h1>
        <UploadDocumentButton />
      </div>

      {documents === undefined && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-x-6 gap-y-10">
          {new Array(8).fill("").map((i, _) => (
            <div key={_}>
              <SkeletonCard />
            </div>
          ))}
        </div>
      )}

      {documents && documents.length === 0 && <NoDocuments />}

      <Unauthenticated>
        <div className="flex flex-col text-xl gap-8 cursor-pointer items-center pt-12 justify-center">
          <div className="flex gap-2 items-center justify-center">
            Please
            <SignInButton />
            to use our services
          </div>
          <Image
            src="/undraw_welcome_re_h3d9.svg"
            alt="authentication"
            height={300}
            width={300}
          />
        </div>
      </Unauthenticated>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {documents &&
          documents.map((doc) => (
            <div key={doc._id}>
              <DocumentCard document={doc} />
            </div>
          ))}
      </div>
    </main>
  );
}

function NoDocuments() {
  return (
    <div className="flex flex-col items-center justify-center h-[25rem]">
      <Card className="mt-10 w-[350px] flex flex-col gap-4 items-center justify-center">
        <CardHeader>
          <CardDescription className="text-lg">
            You haven&apos;t uploaded a document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image
            src="/undraw_add_files_re_v09g.svg"
            alt="upload-in-empty"
            height="150"
            width="150"
            priority
          />
        </CardContent>
        <CardFooter>
          <UploadDocumentButton />
        </CardFooter>
      </Card>
    </div>
  );
}
