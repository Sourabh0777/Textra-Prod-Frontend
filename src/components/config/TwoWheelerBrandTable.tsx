import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ITwoWheelerBrand, ITwoWheelerModel } from '@/types';
import { Pencil, Trash2, ChevronDown, ChevronRight, Plus } from 'lucide-react';

interface TwoWheelerBrandTableProps {
  brands: ITwoWheelerBrand[];
  onEdit: (brand: ITwoWheelerBrand) => void;
  onDelete: (id: string) => void;
  expandedBrands: Record<string, boolean>;
  onToggleExpand: (brandId: string) => void;
  onAddModel: (brandId: string) => void;
  onEditModel: (brandId: string, model: ITwoWheelerModel) => void;
  onDeleteModel: (brandId: string, modelName: string) => void;
}

export function TwoWheelerBrandTable({
  brands,
  onEdit,
  onDelete,
  expandedBrands,
  onToggleExpand,
  onAddModel,
  onEditModel,
  onDeleteModel,
}: TwoWheelerBrandTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200">
      <Table>
        <TableHead className="bg-neutral-50">
          <TableRow>
            <TableHeaderCell className="w-10">{''}</TableHeaderCell>
            <TableHeaderCell>Brand Name</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell className="text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {brands.map((brand) => {
            const brandId = String(brand._id);
            const isExpanded = !!expandedBrands[brandId];
            const models = brand.models || [];

            return (
              <React.Fragment key={brandId}>
                <TableRow className={isExpanded ? 'bg-orange-50/30' : ''}>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onToggleExpand(brandId)}>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-orange-600" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell>
                    <Badge variant={brand.is_active ? 'success' : 'danger'}>
                      {brand.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={() => onToggleExpand(brandId)}>
                        Manage Models
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(brand)}>
                        < Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(brandId)}>
                        < Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={4} className="p-0 border-t-0">
                      <div className="bg-neutral-50/50 px-12 py-4 border-l-2 border-orange-500 ml-4 mb-4 mt-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-semibold text-neutral-700">Models in {brand.name}</h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="border border-neutral-200 bg-white hover:bg-neutral-100"
                            onClick={() => onAddModel(brandId)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Model
                          </Button>
                        </div>
                        {models.length > 0 ? (
                          <div className="rounded-md border border-neutral-200 bg-white overflow-hidden shadow-sm max-w-md">
                            <Table>
                              <TableHead className="bg-neutral-100/50">
                                <TableRow>
                                  <TableHeaderCell className="py-2">Model Name</TableHeaderCell>
                                  <TableHeaderCell className="text-right py-2">Actions</TableHeaderCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {models.map((model, idx) => {
                                  return (
                                    <TableRow
                                      key={`${model.name}-${idx}`}
                                      className="hover:bg-neutral-50 transition-colors"
                                    >
                                      <TableCell className="py-2 text-sm font-medium">{model.name}</TableCell>
                                      <TableCell className="text-right py-2">
                                        <div className="flex justify-end gap-1">
                                          <Button variant="ghost" size="sm" onClick={() => onEditModel(brandId, model)}>
                                            <Pencil className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDeleteModel(brandId, model.name)}
                                          >
                                            <Trash2 className="h-3 w-3 text-red-500" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-6 border border-dashed border-neutral-300 rounded-md bg-white text-neutral-500 text-xs">
                            No models defined for this brand.
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
          {brands.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-neutral-500">
                <div className="flex flex-col items-center gap-2">
                  <p className="font-medium text-neutral-600">No brands found</p>
                  <p className="text-sm">Get started by adding your first two-wheeler brand.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
