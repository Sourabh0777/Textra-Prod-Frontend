'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Command } from 'cmdk';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

interface ComboboxOption {
  value: string;
  label: string;
  searchTerms?: string; // Optional terms to search by (e.g. phone, email)
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  label?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No option found.',
  label,
  error,
  fullWidth = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={cn('relative', fullWidth && 'w-full', className)}>
      {label && <label className="block text-sm font-semibold text-neutral-700 mb-1.5">{label}</label>}

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'flex h-10 w-full items-center justify-between rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:ring-red-500',
              !value && 'text-neutral-500',
            )}
          >
            <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="z-[9999] w-[var(--radix-popover-trigger-width)] min-w-[200px] overflow-hidden rounded-md border border-neutral-200 bg-white p-0 shadow-md animate-in fade-in-0 zoom-in-95"
            align="start"
            sideOffset={4}
          >
            <Command className="flex h-full w-full flex-col overflow-hidden">
              <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Command.Input
                  placeholder={searchPlaceholder}
                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
                <Command.Empty className="py-6 text-center text-sm text-neutral-500">{emptyMessage}</Command.Empty>
                <Command.Group>
                  {options.map((option) => (
                    <Command.Item
                      key={option.value}
                      value={option.searchTerms || option.label}
                      onSelect={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className={cn(
                        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-neutral-100 aria-selected:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                        value === option.value && 'bg-neutral-50',
                      )}
                    >
                      <Check className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                      <span className="flex-1 truncate">{option.label}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
