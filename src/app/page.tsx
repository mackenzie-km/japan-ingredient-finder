import { SearchExperience } from "@/components/SearchExperience";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center font-sans">
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center gap-6 py-12 px-6">
        <h1 className="font-script text-5xl sm:text-6xl font-bold tracking-tight text-center">
          🇯🇵 Ingredient Finder
        </h1>

        <div className="w-full rounded-3xl bg-white dark:bg-[#2a2118] shadow-lg shadow-black/5 dark:shadow-black/30 px-6 py-10 sm:px-10 flex flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              What are you looking for?
            </h2>
            <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-amber-600" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 max-w-md">
              Search an ingredient or brand across Japan import/grocery services.
            </p>
          </div>
          <SearchExperience />
        </div>
      </main>
    </div>
  );
}
