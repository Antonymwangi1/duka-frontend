export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12">
        <div>
          <h1 className="text-4xl font-bold text-primary-foreground">Duka</h1>
          <p className="text-primary-foreground/70 mt-2 text-lg">
            Shop Management System
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-primary-foreground/10 rounded-2xl p-6">
            <p className="text-primary-foreground text-lg leading-relaxed">
              "Duka has completely changed how I manage my shop. I can see my
              profits every day without doing any calculations."
            </p>
            <div className="mt-4">
              <p className="text-primary-foreground font-semibold">
                James Kamau
              </p>
              <p className="text-primary-foreground/70 text-sm">
                Shop owner, Thika
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Shops", value: "500+" },
              { label: "Daily Sales", value: "10k+" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-primary-foreground/10 rounded-xl p-4 text-center"
              >
                <p className="text-primary-foreground text-2xl font-bold">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/70 text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-primary-foreground/50 text-sm">
          © 2026 Duka. Built for Kenyan businesses.
        </p>
      </div>

      {/* Right side — auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Duka</h1>
            <p className="text-muted-foreground mt-1">Shop Management System</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
