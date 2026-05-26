'use client';

import { useState } from 'react';
import { useFetchOpticalCustomersQuery, useCreateOpticalCustomerMutation } from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { Modal } from '@/components/ui/modal';
import { Label } from '@/components/ui/label';
import { Search, UserPlus, Phone, Mail, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type OpticalCustomer = {
  _id: string;
  uid: string;
  name: string;
  phone_number: string;
  email?: string;
  age?: number;
  gender?: string;
  created_at: string;
};

type NewPatientPayload = {
  name: string;
  phone_number: string;
  email: string;
  age: string;
  gender: string;
  address: string;
  notes: string;
};

export default function OpticalCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState<NewPatientPayload>({
    name: '',
    phone_number: '',
    email: '',
    age: '',
    gender: 'male',
    address: '',
    notes: '',
  });

  const { data: customers, isLoading, refetch } = useFetchOpticalCustomersQuery(searchTerm);
  const [createCustomer, { isLoading: isCreating }] = useCreateOpticalCustomerMutation();

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.phone_number) {
      toast.error('Name and Phone number are required.');
      return;
    }

    try {
      await createCustomer({
        ...newPatient,
        age: newPatient.age ? parseInt(newPatient.age, 10) : undefined,
      }).unwrap();
      toast.success('Patient profile registered successfully!');
      setIsAddModalOpen(false);
      setNewPatient({
        name: '',
        phone_number: '',
        email: '',
        age: '',
        gender: 'male',
        address: '',
        notes: '',
      });
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create patient.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Patients Registry
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Manage eye examination patient profiles, records, and contact information.
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#15368A] hover:bg-[#0f286b] text-white flex items-center gap-2 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-md"
        >
          <UserPlus className="w-4 h-4" />
          Add New Patient
        </Button>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 border border-slate-100 shadow-sm rounded-xl bg-white flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patients by name or phone number..."
            className="pl-10 w-full border-slate-200 rounded-xl focus:border-[#15368A] transition-all"
          />
        </div>
      </Card>

      {/* Grid / Table Container */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <TableRow className="bg-slate-50/50">
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Patient Details</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Contact</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Demographics</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Registered</th>
                  <th className="px-6 py-3 text-right font-bold text-slate-600">Actions</th>
                </TableRow>
              </thead>
              <TableBody>
                {customers && customers.length > 0 ? (
                  customers.map((customer: OpticalCustomer) => (
                    <TableRow key={customer._id} className="hover:bg-slate-50/30 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-sm">{customer.name}</span>
                          <span className="text-slate-400 text-xxs mt-0.5 font-mono">{customer.uid}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1 text-slate-600 text-xs">
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {customer.phone_number}
                          </span>
                          {customer.email && (
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <Mail className="w-3.5 h-3.5" />
                              {customer.email}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-slate-600 text-xs capitalize">
                          {customer.age ? `${customer.age} yrs` : 'N/A'} • {customer.gender || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-500 text-xs flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(customer.created_at).toLocaleDateString('en-GB')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/optical-service/customers/${customer._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-white bg-[#15368A] hover:bg-[#0d2663] transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Profile
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                      No patients registered with this criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Add Patient Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Patient"
      >
        <form onSubmit={handleCreatePatient} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-slate-700">Patient Full Name *</Label>
            <Input
              id="name"
              required
              value={newPatient.name}
              onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              placeholder="e.g. Ramesh Kumar"
              className="rounded-xl border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-slate-700">Phone Number *</Label>
              <Input
                id="phone"
                required
                value={newPatient.phone_number}
                onChange={(e) => setNewPatient({ ...newPatient, phone_number: e.target.value })}
                placeholder="10-digit mobile"
                className="rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700">Email Address (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                placeholder="name@domain.com"
                className="rounded-xl border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="age" className="text-slate-700">Age</Label>
              <Input
                id="age"
                type="number"
                value={newPatient.age}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                placeholder="Years"
                className="rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gender" className="text-slate-700">Gender</Label>
              <select
                id="gender"
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-slate-700">Postal Address</Label>
            <Input
              id="address"
              value={newPatient.address}
              onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
              placeholder="Full residence address"
              className="rounded-xl border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-slate-700">Optometrist&apos;s Notes / Complaints</Label>
            <Input
              id="notes"
              value={newPatient.notes}
              onChange={(e) => setNewPatient({ ...newPatient, notes: e.target.value })}
              placeholder="e.g. blurred vision, dry eyes, frame upgrade"
              className="rounded-xl border-slate-200"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-[#15368A] hover:bg-[#0d2663] text-white rounded-xl"
            >
              {isCreating ? 'Creating...' : 'Register Patient'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
