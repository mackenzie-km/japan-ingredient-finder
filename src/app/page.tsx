import { SearchExperience } from "@/components/SearchExperience";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center gap-6 py-12 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Japan Ingredient Finder
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Search an ingredient or brand across Japan import/grocery services.
          </p>
        </div>
        <SearchExperience />
      </main>
    </div>
  );
}
