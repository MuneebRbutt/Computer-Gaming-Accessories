"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function AccountDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Error signing out");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-3xl font-bold text-gray-900">Welcome back, {session?.user?.name || "Gamer"}!</div>
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-sm transition duration-200 disabled:opacity-50"
        >
          {isLoading ? "Signing out..." : "Sign Out"}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border border-gray-200 rounded-lg bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-2">Recent Orders</div>
          <div className="text-3xl font-bold text-gray-900">2</div>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-2">Wishlist Items</div>
          <div className="text-3xl font-bold text-gray-900">5</div>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-2">Loyalty Points</div>
          <div className="text-3xl font-bold text-primary">1,250</div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
          <p className="flex items-center">
            <span className="font-semibold text-gray-700 w-32">Email:</span>
            <span className="text-gray-900">{session?.user?.email || "example@email.com"}</span>
          </p>
          <p className="flex items-center">
            <span className="font-semibold text-gray-700 w-32">Member since:</span>
            <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
          </p>
        </div>
      </div>
    </div>
  );
}


