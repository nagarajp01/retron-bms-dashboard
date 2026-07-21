export default function PageContainer({ children }) {
  return (
    <main className="min-h-screen bg-[#0F1117] px-5 py-5">
      <div className="mx-auto max-w-[1700px]">
        {children}
      </div>
    </main>
  );
}