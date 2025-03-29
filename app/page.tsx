import Link from "next/link";

export default function Home() {
  return (
    <main className="w-screen h-screen bg-black flex justify-center items-center text-white">
      <div className="max-w-[70ch]">
        <h1 className="text-6xl mb-6">ReflectAI. A journal that talks back.</h1>
        <p className="text-xl text-white/80 mb-12 leading-8 font-light">
          Capture your thoughts effortlessly with ReflectAI, the intelligent
          journaling app that helps you track your emotions, organize your
          ideas, and gain insights through AI-powered reflections.
        </p>
        <div>
          <Link href="/register" className="bg-indigo-600 py-4 px-6 rounded">
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
