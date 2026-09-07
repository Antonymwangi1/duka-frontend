export default function SelectShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Duka</h1>
          <p className="text-muted-foreground mt-1">
            Select a shop to continue
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
