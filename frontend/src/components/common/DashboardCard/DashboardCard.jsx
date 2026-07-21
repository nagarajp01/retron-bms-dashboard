export default function DashboardCard({
  title,
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-xl border border-[#2B313C] bg-[#181C24] ${className}`}
    >
      <div className="border-b border-[#2B313C] px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          {title}
        </h2>
      </div>

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}