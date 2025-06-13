"use client";

import { useEffect, useState } from "react";
import { SearchForm } from "./search-form";
import { api } from "@/convex/_generated/api";
import SearchResultComponent from "./search-result-component";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";

export default function SearchPage() {
  const user = useQuery(api.user.getUser);

  const [results, setResults] =
    useState<typeof api.search.searchAction._returnType>();

  useEffect(() => {
    const localResults = localStorage.getItem("searchResults");
    if (!localResults) return;
    setResults(JSON.parse(localResults));
  }, []);

  const deleteSearchResults = () => {
    if (results && results.length > 0) {
      setResults([]);
      localStorage.removeItem("searchResults");
    }
  };

  return (
    <main className="space-y-8 w-full px-6">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-cyan-500 text-3xl">Search</h1>
        {user?.isPremium === false && (
          <span className="text-md text-gray-200 font-semibold">
            ({user?.searches} of 10 left)
          </span>
        )}
        {results && results.length > 0 && (
          <Button onClick={deleteSearchResults} variant={"destructive"}>
            Delete Search Results
          </Button>
        )}
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
