"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  // Function to navigate to the dashboard
  const goToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Farm Management System</h1>
      <p className="text-lg text-gray-700 mb-8">
        Monitor your farm, automate tasks, track inventory, and more.
      </p>

      <Button onClick={goToDashboard} className="bg-blue-500 text-white px-4 py-2">
        Go to Dashboard
      </Button>
    </div>
  );
}
