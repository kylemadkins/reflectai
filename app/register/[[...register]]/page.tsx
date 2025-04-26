import { SignUp } from "@clerk/nextjs";

export default async function Page({
  searchParams,
}: {
  searchParams: { redirect_url?: string };
}) {
  let { redirect_url: redirectUrl } = await searchParams;
  redirectUrl = redirectUrl || "/journal"; // Fallback

  return (
    <main className="h-full bg-black flex justify-center items-center">
      <SignUp
        forceRedirectUrl={`/api/auth/callback?redirectUrl=${encodeURIComponent(
          redirectUrl
        )}`}
      />
    </main>
  );
}
