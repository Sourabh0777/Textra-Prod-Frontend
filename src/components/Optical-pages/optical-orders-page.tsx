'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFetchLensOrdersQuery, useFetchFrameOrdersQuery, useDeleteLensOrderMutation, useDeleteFrameOrderMutation } from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { Badge } from '@/components/ui/badge';
import { PackagePlus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function OpticalOrdersPage() {
  const { data: lensOrders, isLoading: loadingLens, refetch: refetchLens } = useFetchLensOrdersQuery(undefined);
  const { data: frameOrders, isLoading: loadingFrame, refetch: refetchFrame } = useFetchFrameOrdersQuery(undefined);
  const [deleteLensOrder, { isLoading: isDeletingLens }] = useDeleteLensOrderMutation();
  const [deleteFrameOrder, { isLoading: isDeletingFrame }] = useDeleteFrameOrderMutation();

  const handleLensDelete = async (id: string) => {
    try {
      await deleteLensOrder(id).unwrap();
      toast.success('Lens order removed.');
      refetchLens();
    } catch (error: unknown) {
      toast.error('Unable to delete lens order.');
    }
  };

  const handleFrameDelete = async (id: string) => {
    try {
      await deleteFrameOrder(id).unwrap();
      toast.success('Frame order removed.');
      refetchFrame();
    } catch (error: unknown) {
      toast.error('Unable to delete frame order.');
    }
  };

  const loading = loadingLens || loadingFrame;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Optical Orders</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Review lenses and frame orders and manage order activity.
          </p>
        </div>
        <Link
          href="/optical-service/orders/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#15368A] text-white text-sm font-semibold hover:bg-[#0f286b] transition-all duration-300"
        >
          <PackagePlus className="w-4 h-4" />
          Create Order
        </Link>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        {loading ? (
          <div className="flex h-56 items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <TableRow className="bg-slate-50/50">
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Order Type</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Customer</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Product</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Price</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Quantity</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Order Date</th>
                  <th className="px-6 py-3 text-right font-bold text-slate-600">Actions</th>
                </TableRow>
              </thead>
              <TableBody>
                {lensOrders && lensOrders.map((order: any) => (
                  <TableRow key={order._id} className="hover:bg-slate-50/30 transition-colors">
                    <TableCell>
                      <Badge className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">Lens</Badge>
                    </TableCell>
                    <TableCell>{order.customer_id?.name ?? 'Unknown'}</TableCell>
                    <TableCell>{order.lens_type ?? 'Lens order'}</TableCell>
                    <TableCell>₹{order.price?.toFixed?.(2) ?? '0.00'}</TableCell>
                    <TableCell>{order.quantity ?? 1}</TableCell>
                    <TableCell>{new Date(order.order_date).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleLensDelete(order._id)}
                          disabled={isDeletingLens}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {frameOrders && frameOrders.map((order: any) => (
                  <TableRow key={order._id} className="hover:bg-slate-50/30 transition-colors">
                    <TableCell>
                      <Badge className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">Frame</Badge>
                    </TableCell>
                    <TableCell>{order.customer_id?.name ?? 'Unknown'}</TableCell>
                    <TableCell>{order.frame_name ?? 'Frame order'}</TableCell>
                    <TableCell>₹{order.price?.toFixed?.(2) ?? '0.00'}</TableCell>
                    <TableCell>{order.quantity ?? 1}</TableCell>
                    <TableCell>{new Date(order.order_date).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleFrameDelete(order._id)}
                          disabled={isDeletingFrame}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!(lensOrders?.length || frameOrders?.length) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                      No orders created yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
