import React from 'react'
import { cva } from 'class-variance-authority'

interface Column {
  key: string
  header: string
  width?: string
}

interface TableProps {
  columns: Column[]
  data: Record<string, any>[]
  className?: string
}

export const Table: React.FC<TableProps> = ({ columns, data, className }) => {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse ${className}`}>
        <thead>
          <tr className="border-b border-primary-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left text-sm font-medium text-primary-700 ${column.width || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-primary-100 hover:bg-primary-50 transition-colors"
            >
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  className="px-4 py-3 text-sm text-primary-600"
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}