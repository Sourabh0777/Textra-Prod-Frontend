/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import Link from 'next/link';
import { useDashboardPage } from '@/lib/hooks/use-dashboard-page';

export default function DashboardPage() {
  const { stats, modules, loading } = useDashboardPage();

  if (loading) {
    return (
      <>
        <Header title="Dashboard" subtitle="Welcome to your Textra - Whatsapp remminder Solution" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Dashboard" subtitle="Welcome to your Textra - Whatsapp remminder Solution" />

      <div className="p-4 md:p-8">
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
                <Link
                  key={module.href}
                  href={module.href}
                  className="p-3 md:p-4 border border-neutral-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                >
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
