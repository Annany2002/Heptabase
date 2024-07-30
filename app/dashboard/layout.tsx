import SideNav from "./side-nav";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen container gap-24 mx-auto pt-12">
      <SideNav />
      <div className="w-full">{children}</div>
    </div>
  );
}
