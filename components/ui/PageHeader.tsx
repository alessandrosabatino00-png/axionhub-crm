import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  live?: boolean
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, live, actions }: PageHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-6 h-16 flex-shrink-0 -mx-8 -mt-8 mb-6"
      style={{
        borderBottom: '0.5px solid var(--ax-border)',
        background: 'linear-gradient(90deg, rgba(26,79,214,0.04) 0%, var(--ax-bg) 40%)',
      }}
    >
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-[16px] font-semibold tracking-tight" style={{ color: 'var(--ax-t1)' }}>
            {title}
          </h1>
          {live && (
            <span
              className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '0.5px solid rgba(16,185,129,0.25)' }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              live
            </span>
          )}
        </div>
        {subtitle && (
          <div className="text-[11px] mt-0.5" style={{ color: 'var(--ax-t3)' }}>
            {subtitle}
          </div>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  )
}
