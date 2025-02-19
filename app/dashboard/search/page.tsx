"use client";

import { useEffect, useState } from "react";
import { SearchForm } from "./search-form";
import { api } from "@/convex/_generated/api";
import SearchResultComponent from "./search-result-component";

export default function SearchPage() {
  const [results, setResults] =
    useState<typeof api.search.searchAction._returnType>();

  useEffect(() => {
    const localResults = localStorage.getItem("searchResults");
    if (!localResults) return;
    setResults(JSON.parse(localResults));
  }, []);

  return (
    <main className="space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl">Search</h1>
      </div>
      <SearchForm
        setResults={(results) => {
          setResults(results);
          localStorage.setItem("searchResults", JSON.stringify(results));
        }}
      />
      <ul className="flex flex-col gap-4">
        {results?.map((result) => {
          if (result.type === "notes") {
            return (
              <SearchResultComponent
                url={`/dashboard/notes/${result.record._id}`}
                score={result.score}
                text={result.record.text}
                type="notes"
                key={result.record._id}
              />
            );
          } else {
            return (
              <SearchResultComponent
                url={`/dashboard/documents/${result.record._id}`}
                score={result.score}
                text={result.record.title + " : " + result.record.description}
                type="documents"
                key={result.record._id}
              />
            );
          }
        })}
      </ul>
    </main>
  );
}
