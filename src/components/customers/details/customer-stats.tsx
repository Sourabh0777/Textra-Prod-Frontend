import { Card, CardBody } from '@/components/ui/card';
import { Bike, History, Bell } from 'lucide-react';

interface CustomerStatsProps {
  vehiclesCount: number;
  servicesCount: number;
  remindersCount: number;
}

export function CustomerStats({ vehiclesCount, servicesCount, remindersCount }: CustomerStatsProps) {
  return (
    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-blue-50/50 border-blue-100">
        <CardBody className="p-4 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
            <Bike size={20} />
          </div>
          <span className="text-2xl font-bold text-blue-700">{vehiclesCount}</span>
          <span className="text-xs text-blue-600 font-medium uppercase tracking-wider">Vehicles</span>
        </CardBody>
      </Card>
      <Card className="bg-indigo-50/50 border-indigo-100">
        <CardBody className="p-4 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
            <History size={20} />
          </div>
          <span className="text-2xl font-bold text-indigo-700">{servicesCount}</span>
          <span className="text-xs text-indigo-600 font-medium uppercase tracking-wider">Services</span>
        </CardBody>
      </Card>
      <Card className="bg-amber-50/50 border-amber-100">
        <CardBody className="p-4 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
            <Bell size={20} />
          </div>
          <span className="text-2xl font-bold text-amber-700">{remindersCount}</span>
          <span className="text-xs text-amber-600 font-medium uppercase tracking-wider">Reminders</span>
        </CardBody>
      </Card>
    </div>
  );
}
