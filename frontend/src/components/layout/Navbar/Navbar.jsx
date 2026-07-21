
export default function Navbar() {
  return (
    <header className="mb-5 rounded-xl border border-[#2B313C] bg-[#181C24]">

      <div className="flex h-16 items-center justify-between px-5">

        <div className="flex items-center gap-4">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#39E5C4] font-bold text-black">

            R

          </div>

          <div>

            <h1 className="font-semibold text-white">

              Retron BMS Console

            </h1>

            <p className="text-xs text-slate-400">

              Battery Test Monitoring System

            </p>

          </div>

        </div>


      </div>

    </header>
  );
}