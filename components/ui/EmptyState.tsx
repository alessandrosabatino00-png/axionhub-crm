import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 gap-4 text-center">
      <div
        className="w-14 h-14 rounded-[14px] flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(26,79,214,0.12), rgba(10,189,212,0.06))',
          border: '0.5px solid rgba(26,79,214,0.2)',
        }}
      >
        <Icon size={24} style={{ color: 'var(--ax-cyan)' }} strokeWidth={1.5} />
      </div>
      <div>
        <div className="text-[13px] font-medium" style={{ color: 'var(--ax-t1)' }}>{title}</div>
        {description && (
          <div className="text-[11px] mt-1 max-w-[260px]" style={{ color: 'var(--ax-t3)' }}>
            {description}
          </div>
        )}
      </div>
      {action}
    </div>
  )
}
