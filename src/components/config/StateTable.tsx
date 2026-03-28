import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IState, IZone } from '@/types';
import { Pencil, Trash2, ChevronDown, ChevronRight, Plus } from 'lucide-react';

interface StateTableProps {
  states: IState[];
  onEdit: (state: IState) => void;
  onDelete: (id: string) => void;
  expandedStates: Record<string, boolean>;
  onToggleExpand: (stateId: string) => void;
  zonesByState: Record<string, IZone[]>;
  onAddZone: (zone?: IZone) => void;
  onEditZone: (zone: IZone) => void;
  onDeleteZone: (id: string) => void;
}

export function StateTable({
  states,
  onEdit,
  onDelete,
  expandedStates,
  onToggleExpand,
  zonesByState,
  onAddZone,
  onEditZone,
  onDeleteZone,
}: StateTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200">
      <Table>
        <TableHead className="bg-neutral-50">
          <TableRow>
            <TableHeaderCell className="w-10">{''}</TableHeaderCell>
            <TableHeaderCell>State Name</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell className="text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {states.map((state) => {
            const stateId = String(state._id || (state as any).id || '');
            const isExpanded = !!expandedStates[stateId];
            const zones = zonesByState[stateId] || [];

            return (
              <React.Fragment key={stateId}>
                <TableRow className={isExpanded ? 'bg-blue-50/30' : ''}>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onToggleExpand(stateId)}>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-blue-600" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{state.name}</TableCell>
                  <TableCell>
                    <Badge variant={state.is_active ? 'success' : 'danger'}>
                      {state.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(state)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(stateId)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={4} className="p-0 border-t-0">
                      <div className="bg-neutral-50/50 px-12 py-4 border-l-2 border-blue-500 ml-4 mb-4 mt-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-semibold text-neutral-700">Zones in {state.name}</h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="border border-neutral-200"
                            onClick={() => onAddZone({ state_id: stateId } as IZone)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Zone
                          </Button>
                        </div>
                        {zones.length > 0 ? (
                          <div className="rounded-md border border-neutral-200 bg-white overflow-hidden shadow-sm">
                            <Table>
                              <TableHead className="bg-neutral-100/50">
                                <TableRow>
                                  <TableHeaderCell className="py-2">Zone Name</TableHeaderCell>
                                  <TableHeaderCell className="py-2">Status</TableHeaderCell>
                                  <TableHeaderCell className="text-right py-2">Actions</TableHeaderCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {zones.map((zone) => {
                                  console.log(zone);
                                  const zoneId = String(zone._id);
                                  return (
                                    <TableRow key={zoneId} className="hover:bg-neutral-50 transition-colors">
                                      <TableCell className="py-2 text-sm">{zone.name}</TableCell>
                                      <TableCell className="py-2">
                                        <Badge
                                          variant={zone.is_active ? 'success' : 'danger'}
                                          className="text-[10px] px-1.5 py-0"
                                        >
                                          {zone.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-right py-2">
                                        <div className="flex justify-end gap-1">
                                          <Button variant="ghost" size="sm" onClick={() => onEditZone(zone)}>
                                            <Pencil className="h-3 w-3" />
                                          </Button>
                                          <Button variant="ghost" size="sm" onClick={() => onDeleteZone(zoneId)}>
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
                            No zones defined for this state.
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
          {states.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-neutral-500">
                <div className="flex flex-col items-center gap-2">
                  <p className="font-medium text-neutral-600">No states found</p>
                  <p className="text-sm">Get started by adding your first state.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
