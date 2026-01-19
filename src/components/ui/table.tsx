import type React from "react"

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
}

export function Table({ children, className = "", ...props }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-left text-neutral-900 ${className}`} {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHead({ children, className = "", ...props }: TableHeadProps) {
  return (
    <thead className={`bg-neutral-100 border-b border-neutral-200 ${className}`} {...props}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className = "", ...props }: TableBodyProps) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className = "", ...props }: TableRowProps) {
  return (
    <tr className={`border-b border-neutral-200 hover:bg-neutral-50 ${className}`} {...props}>
      {children}
    </tr>
  )
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}

export function TableCell({ children, className = "", ...props }: TableCellProps) {
  return (
    <td className={`px-6 py-3 text-neutral-700 ${className}`} {...props}>
      {children}
    </td>
  )
}

export function TableHeaderCell({ children, className = "", ...props }: TableCellProps) {
  return (
    <th className={`px-6 py-3 font-semibold text-neutral-900 bg-neutral-100 ${className}`} {...props}>
      {children}
    </th>
  )
}
