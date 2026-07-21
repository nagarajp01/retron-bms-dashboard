import { useRef } from "react";
import {
  Activity,
  Upload,
  Download,
  Database,
  Wifi,
} from "lucide-react";
import toast from "react-hot-toast";

export default function UploadToolbar({
  session = {
    id: null,
    name: "96V_50AH_Neware_Test",
    device: "Channel 30-1-4",
    records: 2475,
  },

  onImport,
  onExport,
  onDatabase,
}) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      if (onImport) {
        await onImport(file);
      } else {
        toast.success(`Selected: ${file.name}`);
        console.log("Selected file:", file);
      }
    } catch (err) {
      toast.error("Import failed");
      console.error(err);
    }

    e.target.value = "";
  };

  const handleExport = async () => {
    try {
      if (onExport) {
        await onExport(session.id);
      } else {
        toast("Export API not connected yet");
        console.log("Export Session:", session.id);
      }
    } catch (err) {
      toast.error("Export failed");
      console.error(err);
    }
  };

  const handleDatabase = () => {
    if (onDatabase) {
      onDatabase();
    } else {
      toast("Database page coming soon");
    }
  };

  return (
    <div className="mb-5 rounded-xl border border-[#2C3442] bg-[#171B23] shadow-lg">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={handleFileSelected}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        {/* LEFT */}

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-500/15">
              <Activity
                size={22}
                className="text-cyan-400"
              />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Battery Test Session
              </p>

              <h2 className="text-lg font-semibold text-white">
                {session.name}
              </h2>
            </div>
          </div>

          <div className="hidden h-10 w-px bg-[#313846] lg:block" />

          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Device
            </p>

            <p className="font-semibold text-slate-200">
              {session.device}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Records
            </p>

            <p className="font-semibold text-slate-200">
              {session.records}
            </p>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-400" />

            <span className="text-sm font-medium text-green-400">
              STREAMING
            </span>
          </div>

          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 rounded-lg border border-[#323948] bg-[#202733] px-4 py-2 text-sm text-slate-300 transition hover:bg-[#293241]"
          >
            <Upload size={17} />
            Import Test
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-[#323948] bg-[#202733] px-4 py-2 text-sm text-slate-300 transition hover:bg-[#293241]"
          >
            <Download size={17} />
            Export
          </button>

          {/* <button
            onClick={handleDatabase}
            className="flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
          >
            <Database size={17} />
            Database
          </button> */}

          <div className="flex items-center gap-2 rounded-lg border border-[#323948] bg-[#202733] px-4 py-2">
            <Wifi
              size={16}
              className="text-green-400"
            />

            <span className="text-sm text-slate-300">
              Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}