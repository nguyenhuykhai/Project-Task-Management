import { Navbar } from "@/components/layouts/admin-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div className="w-full">
      <Navbar title={title} />
      {/* Updated: Ensure container has correct text color */}
      <div>{children}</div>
    </div>
  );
}
