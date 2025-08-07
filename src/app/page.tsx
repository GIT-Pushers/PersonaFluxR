"use client";
import Logout from "@/components/Signout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      <Logout />
    </div>
  );
}
