import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const links = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/journal",
      label: "Journal",
    },
  ];

  return (
    <main className="h-screen w-screen flex">
      <div className="h-full w-[200px] shrink-0 border-r border-black/10">
        <ul className="pt-8">
          {links.map((link) => (
            <li key={link.href} className="px-6 py-2">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full">
        <header className="h-[60px] border-b border-black/10">
          <div className="h-full w-full px-6 flex items-center justify-end">
            <UserButton />
          </div>
        </header>
        <div className="h-[calc(100vh-60px)]">{children}</div>
      </div>
    </main>
  );
}
