import DashboardCard from "../../common/DashboardCard/DashboardCard";

export default function TestStepPlan({ stepPlan }) {
  if (!Array.isArray(stepPlan) || stepPlan.length === 0) {
    return null;
  }

  const columns = Object.keys(stepPlan[0]);

  return (
    <DashboardCard
      title="Test Step Plan"
      className="border-[#2B313C] bg-[#181C24]"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#2B313C] bg-[#141821]">
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-left font-semibold text-cyan-400 whitespace-nowrap"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {stepPlan.map((row, index) => (
              <tr
                key={index}
                className="border-b border-[#2B313C] hover:bg-[#1A202A]"
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className="px-4 py-3 text-slate-200 whitespace-nowrap"
                  >
                    {row[column] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}