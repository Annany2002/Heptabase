import SideNav from "./side-nav";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex container gap-20 mx-auto pt-12">
      <SideNav />
      <div className="w-full">{children}</div>
    </div>
  );
}
