import { FileText, Notebook } from "lucide-react";
import Link from "next/link";

export default function SearchResultComponent({
  type,
  url,
  text,
  score,
}: {
  type: string;
  url: string;
  text: string;
  score: number;
}) {
  return (
    <Link
      href={url}
      className="bg-slate-100 border dark:bg-slate-800 p-4 rounded-md "
    >
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            {type === "notes" ? (
              <>
                <Notebook size={20} color="#8c8b87" />
                <p className="text-xl text-[#8c8b87]">Note</p>
              </>
            ) : (
              <>
                <FileText color="#8c8b87" size={20} />
                <p className="text-xl text-[#8c8b87]">Document</p>
              </>
            )}
          </div>
          <p className="text-sm">Matching Score: {score.toPrecision(3)}</p>
        </div>
        <div>
          <li className="whitespace-pre-line">{text}</li>
        </div>
      </div>
    </Link>
  );
}
