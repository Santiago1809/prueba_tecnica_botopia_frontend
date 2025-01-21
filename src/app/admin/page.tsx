"use client";

import DashboardPageContent from "@/components/custom/admin/DashboardPageContent";
import Loader from "@/components/Loader";
import { Suspense } from "react";


export default function AdminDashboard() {
  
  return (
    <Suspense fallback={<Loader size="lg" />}>
      <DashboardPageContent />
    </Suspense>
  );
}
