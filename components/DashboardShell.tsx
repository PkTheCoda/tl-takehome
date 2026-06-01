import Sidebar from "./Sidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 min-h-screen">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="col-span-5 bg-gray-50 p-6 text-black flex flex-col gap-y-6">
        {children}
      </div>
    </div>
  );
}
