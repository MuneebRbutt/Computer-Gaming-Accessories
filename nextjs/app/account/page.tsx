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
        <div className="text-2xl font-semibold">Welcome back, {session?.user?.name || "Gamer"}!</div>
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-200 disabled:opacity-50"
        >
          {isLoading ? "Signing out..." : "Sign Out"}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border border-gray-800 rounded-md bg-card p-4">
          <div className="text-sm text-gray-400">Recent Orders</div>
          <div className="text-2xl font-semibold">2</div>
        </div>
        <div className="border border-gray-800 rounded-md bg-card p-4">
          <div className="text-sm text-gray-400">Wishlist Items</div>
          <div className="text-2xl font-semibold">5</div>
        </div>
        <div className="border border-gray-800 rounded-md bg-card p-4">
          <div className="text-sm text-gray-400">Loyalty Points</div>
          <div className="text-2xl font-semibold">1,250</div>
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="bg-gray-800 rounded-md p-4">
          <p className="mb-2">
            <span className="text-gray-400">Email:</span>{" "}
            {session?.user?.email || "example@email.com"}
          </p>
          <p>
            <span className="text-gray-400">Member since:</span>{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}


