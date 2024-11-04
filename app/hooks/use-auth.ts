"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function useAuth(requireAuth = true) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const { authenticated } = await response.json();

        if (requireAuth && !authenticated) {
          router.push("/login");
        } else if (!requireAuth && authenticated) {
          router.push("/");
        }
      } catch (_error) {
        if (requireAuth) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, router]);

  const logout = async () => {
    try {
      await fetch("/api/auth", {
        method: "DELETE",
      });
      router.push("/login");
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { logout, isLoading };
}
