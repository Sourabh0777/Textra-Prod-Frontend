import { Card, CardBody } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, MapPin } from 'lucide-react';

interface CustomerInfoCardProps {
  customer: {
    name: string;
    is_active: boolean;
    phone_number: string;
    email?: string;
  };
  customerId: string;
}

export function CustomerInfoCard({ customer, customerId }: CustomerInfoCardProps) {
  return (
    <Card className="lg:col-span-1">
      <CardBody className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">{customer.name}</h2>
            <Badge variant={customer.is_active ? 'success' : 'secondary'}>
              {customer.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-neutral-600">
            <Phone size={18} className="text-neutral-400" />
            <span className="text-sm font-medium">{customer.phone_number}</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-600">
            <Mail size={18} className="text-neutral-400" />
            <span className="text-sm font-medium">{customer.email || 'No email provided'}</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-600 pt-2 border-t border-neutral-100">
            <MapPin size={18} className="text-neutral-400" />
            <span className="text-xs">Customer ID: {customerId}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
