import type React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-purple-100 relative">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=3272&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          filter: "brightness(0.4)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Welcome to <span className="text-purple-300">GrowthLink</span>
          </h1>
          <p className="mt-2 text-lg text-purple-200">Empowering Your Growth Journey</p>
        </div>
        {children}
      </div>
    </div>
  );
}
