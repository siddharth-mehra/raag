import Link from "next/link"
import { Spotlight } from "./ui/Spotlight"

const HeroSection = () => {
  return (
    <div className="min-h-screen md:h-[40rem] w-full rounded-md flex flex-col py-10 md:py-10
    items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
        <h1 className="mt-20 lg:text-8xl md:text-6xl text-4xl  md:mt-10  font-bold bg-clip-text text-center
            text-transparent bg-gradient-to-b from-neutral-50 to-nuetral-400">
            Master the Art of Music
        </h1>
        <p className="mt-4 font-normal text-base md:text-lg
        text-neutral-400 max-w-lg mx-auto text-center">
            Dive into our comprehensive Music course 
            and transform your Music journey today.Whether
            you're a beginner or looking to refine your skills,
            join us to unlock your true potential</p>
        <div className="mx-auto">
                <Link href={"/courses"}>
                <button className="mt-20 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border
                     border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium
                     text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    Explore More
                    </button>
                </Link>
        </div>
    </div>
  )
}

export default HeroSection
