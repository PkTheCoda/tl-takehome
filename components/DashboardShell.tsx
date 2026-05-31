import Sidebar from "./Sidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-6 min-h-screen">
      <Sidebar />
      <div className="col-span-5 bg-gray-50 p-6 text-black flex flex-col gap-y-6">
        {children}
      </div>
    </div>
  );
}
