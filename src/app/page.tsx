import { SearchExperience } from "@/components/SearchExperience";

export default function Home() {
  return (
    <>
      <div className="flex flex-col flex-1 items-center font-sans">
        <main className="flex flex-1 w-full max-w-5xl flex-col items-center gap-6 py-10 px-6">
          <h1 className="font-script text-[56px] font-normal leading-[1.2] text-center">
            🇯🇵 Foreign Ingredient Finder
          </h1>

          <div className="w-full rounded-[24px] bg-white border border-[#e5e5e5] shadow-[0_20px_40px_rgba(0,0,0,0.06)] px-6 pt-8 pb-8 sm:px-10 flex flex-col items-center gap-4">
            <div className="text-center flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/jar-icon.png" alt="" className="jar-icon" />
              <h2 className="text-[26px] font-semibold">
                What are you looking for?
              </h2>
              <div className="my-4 h-1 w-[60%] max-w-[8rem] rounded-full bg-gradient-to-r from-[#d68c45] to-[#f1caa1] mb-1" />
              <p className="text-sm text-muted max-w-md my-2">
                Search an ingredient or brand across Japan import/grocery
                services.
              </p>
            </div>
            <SearchExperience />
          </div>
        </main>
      </div>

      <footer className="footer">
        <p>
          Made with care by{" "}
          <a href="https://www.mackenziekg.dev" target="_blank" rel="noreferrer">
            mackenziekg.dev
          </a>{" "}
          in 2026. All rights reserved. See my{" "}
          <a
            href="https://sync.mackenziekg.dev/privacy.html"
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
        </p>
      </footer>
    </>
  );
}
