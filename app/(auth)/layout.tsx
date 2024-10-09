import type React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center w-full px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:w-3/5">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to <span className="text-black">GrowthLink</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">Empowering Your Growth Journey</p>
          </div>
          {children}
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=3272&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="auth-image"
        />
      </div>
    </div>
  );
}
