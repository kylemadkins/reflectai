import { SignUp } from "@clerk/nextjs";

export default async function Page() {
  return (
    <main className="w-screen h-screen bg-black flex justify-center items-center">
      <SignUp />
    </main>
  );
}
