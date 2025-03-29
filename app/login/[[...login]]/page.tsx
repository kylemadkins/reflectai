import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="w-screen h-screen bg-black flex justify-center items-center">
      <SignIn />
    </main>
  );
}
