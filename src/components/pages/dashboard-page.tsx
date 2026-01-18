"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { fetchBusinesses, fetchCustomers, fetchVehicles, fetchReminders } from "@/lib/api";

const MOCK_STATS = [
  { label: "Total Businesses", value: "5", color: "blue" },
  { label: "Total Customers", value: "48", color: "green" },
  { label: "Total Vehicles", value: "62", color: "orange" },
  { label: "Pending Reminders", value: "12", color: "red" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(MOCK_STATS);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const modules = [
    { label: "Manage Businesses", href: "/businesses", icon: "🏢" },
    { label: "Manage Customers", href: "/customers", icon: "👥" },
    { label: "Manage Vehicles", href: "/vehicles", icon: "🏍️" },
    { label: "Manage Services", href: "/services", icon: "🔧" },
    { label: "Manage Reminders", href: "/reminders", icon: "🔔" },
    { label: "View Logs", href: "/whatsapp-logs", icon: "📱" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setApiError(null);

    const [businessesRes, customersRes, vehiclesRes, remindersRes] = await Promise.all([fetchBusinesses(), fetchCustomers(), fetchVehicles(), fetchReminders()]);

    if (!businessesRes.success && businessesRes.error?.includes("not configured")) {
      setApiError("API not configured. Please set NEXT_PUBLIC_API_URL in your environment variables. Using demo data for now.");
      setStats(MOCK_STATS);
      setLoading(false);
      return;
    }

    const businessCount = Array.isArray(businessesRes.data) ? businessesRes.data.length : 0;
    const customerCount = Array.isArray(customersRes.data) ? customersRes.data.length : 0;
    const vehicleCount = Array.isArray(vehiclesRes.data) ? vehiclesRes.data.length : 0;
    const pendingReminders = Array.isArray(remindersRes.data) ? remindersRes.data.filter((r: any) => r.status === "pending").length : 0;

    setStats([
      { label: "Total Businesses", value: String(businessCount), color: "blue" },
      { label: "Total Customers", value: String(customerCount), color: "green" },
      { label: "Total Vehicles", value: String(vehicleCount), color: "orange" },
      { label: "Pending Reminders", value: String(pendingReminders), color: "red" },
    ]);
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header title="Dashboard" subtitle="Welcome to your Bike Service CRM" />

      <div className="p-4 md:p-8">
        {apiError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">{apiError}</p>
            <p className="text-yellow-700 text-xs mt-2">
              To connect to your backend API, set <code className="bg-yellow-100 px-2 py-1 rounded">NEXT_PUBLIC_API_URL</code> in the Vars section of the sidebar or in your{" "}
              <code className="bg-yellow-100 px-2 py-1 rounded">.env.local</code> file.
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardBody className="text-center p-4 md:p-6">
                <p className="text-neutral-600 text-xs md:text-sm font-medium">{stat.label}</p>
                <p className="text-2xl md:text-4xl font-bold text-neutral-900 mt-2">{stat.value}</p>
              </CardBody>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Modules</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {modules.map((module) => (
                <Link key={module.href} href={module.href} className="p-3 md:p-4 border border-neutral-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                  <div className="text-2xl md:text-3xl mb-2">{module.icon}</div>
                  <p className="font-semibold text-neutral-900 text-sm md:text-base">{module.label}</p>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Modules</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {modules.map((module) => (
                <Link key={module.href} href={module.href} className="p-3 md:p-4 border border-neutral-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                  <div className="text-2xl md:text-3xl mb-2">{module.icon}</div>
                  <p className="font-semibold text-neutral-900 text-sm md:text-base">{module.label}</p>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>{" "}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Modules</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {modules.map((module) => (
                <Link key={module.href} href={module.href} className="p-3 md:p-4 border border-neutral-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                  <div className="text-2xl md:text-3xl mb-2">{module.icon}</div>
                  <p className="font-semibold text-neutral-900 text-sm md:text-base">{module.label}</p>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>{" "}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Modules</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {modules.map((module) => (
                <Link key={module.href} href={module.href} className="p-3 md:p-4 border border-neutral-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                  <div className="text-2xl md:text-3xl mb-2">{module.icon}</div>
                  <p className="font-semibold text-neutral-900 text-sm md:text-base">{module.label}</p>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>{" "}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Modules</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {modules.map((module) => (
                <Link key={module.href} href={module.href} className="p-3 md:p-4 border border-neutral-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                  <div className="text-2xl md:text-3xl mb-2">{module.icon}</div>
                  <p className="font-semibold text-neutral-900 text-sm md:text-base">{module.label}</p>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>{" "}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Modules</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {modules.map((module) => (
                <Link key={module.href} href={module.href} className="p-3 md:p-4 border border-neutral-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                  <div className="text-2xl md:text-3xl mb-2">{module.icon}</div>
                  <p className="font-semibold text-neutral-900 text-sm md:text-base">{module.label}</p>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
