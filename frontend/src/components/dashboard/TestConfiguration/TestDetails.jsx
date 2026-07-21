import DashboardCard from "../../common/DashboardCard/DashboardCard";

const fields = [
  { label: "Step Name", key: "stepName" },
  { label: "Builder", key: "builder" },
  { label: "Barcode", key: "barcode" },
  { label: "Remark", key: "remark" },
  { label: "P/N", key: "pn" },

  { label: "Start Step ID", key: "startStepId" },
  { label: "Cycle Count", key: "cycleCount" },
  { label: "Record Settings", key: "recordSettings" },
  { label: "Start Time", key: "startTime" },

  { label: "Nominal Capacity", key: "nominalCapacity" },
  { label: "Active Material", key: "activeMaterial" },

  { label: "Voltage Range", key: "voltageRange" },
  { label: "Current Range", key: "currentRange" },

  { label: "Voltage Upper", key: "voltUpper" },
  { label: "Voltage Lower", key: "voltLower" },

  { label: "Current Upper", key: "currUpper" },
  { label: "Current Lower", key: "currLower" },
];

export default function TestDetails({ test }) {
  if (!test) return null;

  return (
    <DashboardCard
      title="Test Details"
      className="border-[#2B313C] bg-[#181C24]"
    >
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.key}
            className="rounded-lg border border-[#2B313C] bg-[#141821] p-3"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {field.label}
            </p>

            <p className="mt-1 break-all text-sm font-semibold text-white">
              {test[field.key] || "-"}
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}