"use client";

import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// Point to the static file in the public folder
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export async function parsePDF(file: Blob): Promise<string[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = getDocument({
      data: arrayBuffer,
      disableWorker: true, // Crucial for client-side without worker
    } as any);

    const pdf = await loadingTask.promise;
    const textContent: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(" ");
      textContent.push(pageText);
    }
    return textContent;
  } catch (error) {
    console.error("Error parsing PDF: ", error);
    return [];
  }
}
