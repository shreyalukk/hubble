export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: "#FAF6F0" }}>
      {/* Decorative background blobs */}
      <div className="absolute top-[-60px] left-[-60px] w-[250px] h-[250px] rounded-full pointer-events-none" style={{ backgroundColor: "#F5C542", opacity: 0.12 }} />
      <div className="absolute bottom-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full pointer-events-none" style={{ backgroundColor: "#E8DDD0", opacity: 0.25 }} />
      <div className="absolute top-[30%] right-[10%] w-[160px] h-[160px] rounded-full pointer-events-none" style={{ backgroundColor: "#F5C542", opacity: 0.08 }} />
      
      <div className="relative z-10 w-full max-w-lg">
        {children}
      </div>
    </div>
  );
}
