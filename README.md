## Heptabase: An AI Chat PDF Webapp

![Screenshot 2024-10-22 113938](https://github.com/user-attachments/assets/527ec6c0-48ff-452f-8c60-f9c0d25050ba)

### Introduction

Heptabase is a full-stack web application designed to provide users with an intelligent and interactive way to interact with PDF documents. Using advanced AI capabilities powered by the Gemini API, Heptabase offers a seamless experience for users to ask questions, get summaries, and extract relevant information from their PDFs.

### Key Features

- **AI-Powered Chat:** Users can engage in natural language conversations with Heptabase, asking questions about the content of their PDFs.
- **PDF Uploading:** Easily upload PDFs and text-files to the application for analysis.
- **Vector Search:** To efficiently retrieve relevant documents and notes based on semantic similarity, with quick and accurate results.
- **Intelligent Summaries:** Heptabase can generate concise summaries of the key points within a PDF.
- **Information Extraction:** Extract specific information from the PDF based on user queries.
- **Intuitive Interface:** A user-friendly interface makes it simple to interact with the application.

### Usage Limits

| Feature               | Normal Plan | **Premium** (Upcoming) Plan |
| --------------------- | ----------- | --------------------------- |
| **Chats**             | 10          | Unlimited                   |
| **Documents Uploads** | 3           | Unlimited                   |
| **Notes**             | 10          | Unlimited                   |
| **Searches**          | 5           | Unlimited                   |

### Technology Stack

- **Frontend:** Next.js, TypeScript, Shadcn UI components, Clerk for authentication
- **Backend:** Convex DB for data storage and management
- **AI:** Gemini API for natural language processing and understanding

### Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Annany2002/Heptabase.git
   ```
2. **Install Dependencies:**
   ```bash
   cd heptabase
   npm install
   ```
3. **Set Up Environment Variables:**
   Create a `.env.local` file and add the following variables:

   - `NEXT_PUBLIC_CONVEX_DEPLOYMENT`: Your Convex API url
   - `NEXT_PUBLIC_CONVEX_API_KEY`: Your Convex API key
   - `API_KEY`: Your Gemini API key
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `CLERK_SECRET_KEY`: Your Clerk secret key

4. **Run the Development Server:**

   ```bash
   npm run dev
   ```

5. **Run the Convex Database Server**

   ```bash
   npx convex dev
   ```

6. **Access the Application:**
   Open your web browser and navigate to `http://localhost:3000`.

### Additional Notes

- **Data Privacy:** Please ensure that you comply with relevant data privacy regulations when handling user data and PDFs.
- **API Limits:** Be mindful of the usage limits for the Gemini API to avoid exceeding your quota.
- **Customization:** Feel free to customize the application's appearance, features, and functionality to suit your specific needs.
