export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex container justify-center pt-12">{children}</div>;
}
