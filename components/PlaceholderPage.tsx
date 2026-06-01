import DashboardShell from "./DashboardShell";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <DashboardShell>
      <h1 className="title text-primary">{title}</h1>
    </DashboardShell>
  );
}
