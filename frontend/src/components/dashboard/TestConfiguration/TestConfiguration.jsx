import DashboardCard from "../../common/DashboardCard/DashboardCard";
import {
  FileText,
  Cpu,
  User,
  Settings,
  Hash,
  Thermometer,
  Gauge,
  Activity,
  BatteryCharging,
} from "lucide-react";

const fields = [
  {
    key: "stepName",
    label: "Test Name",
    icon: FileText,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    key: "device",
    label: "Device",
    icon: Cpu,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    key: "builder",
    label: "Builder",
    icon: User,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    key: "recordSettings",
    label: "Record Settings",
    icon: Settings,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    key: "cycleCount",
    label: "Cycle Count",
    icon: Hash,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    key: "nominalCapacity",
    label: "Nominal Capacity",
    icon: BatteryCharging,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    key: "voltageRange",
    label: "Voltage Range",
    icon: Gauge,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    key: "currentRange",
    label: "Current Range",
    icon: Activity,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    key: "remarks",
    label: "Remarks",
    icon: Thermometer,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
];

export default function TestConfiguration({
  test,
  unit,
}) {
  if (!test || !unit) return null;

  const firstStep =
    Array.isArray(test.stepPlan) && test.stepPlan.length
      ? test.stepPlan[0]
      : null;

  const config = {
    stepName:
      test.stepName ||
      firstStep?.["Step Name"] ||
      "-",

    device: unit.device || "-",

    builder: test.builder || "-",

    recordSettings:
      test.recordSettings ||
      firstStep?.["Record settings"] ||
      "-",

    cycleCount: test.cycleCount ?? "-",

    nominalCapacity:
      test.nominalCapacity || "-",

    voltageRange:
      test.voltageRange ||
      `${test.voltLower ?? "-"} ~ ${test.voltUpper ?? "-"} V`,

    currentRange:
      test.currentRange ||
      `${test.currLower ?? "-"} ~ ${test.currUpper ?? "-"} A`,

    remarks: test.remarks || "-",
  };

  return (
    <DashboardCard
      title="Test Configuration"
      className="border-[#2B313C] bg-[#181C24]"
    >
      <div className="grid gap-3">
        {fields.map((field) => {
          const Icon = field.icon;

          return (
            <div
              key={field.key}
              className="flex items-center justify-between rounded-xl border border-[#2B313C] bg-[#141821] px-4 py-3 transition-all duration-300 hover:border-cyan-500/30 hover:bg-[#1A202A]"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${field.bg}`}>
                  <Icon
                    size={18}
                    className={field.color}
                  />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                    {field.label}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white break-all">
                    {config[field.key]}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}