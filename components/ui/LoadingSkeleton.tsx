interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton rounded-[6px] ${className}`} />
}

export function MetricCardSkeleton() {
  return (
    <div className="px-[18px] py-5" style={{ borderRight: '0.5px solid var(--ax-border)' }}>
      <Skeleton className="h-[10px] w-20 mb-3" />
      <Skeleton className="h-[28px] w-16 mb-2" />
      <Skeleton className="h-[14px] w-24" />
    </div>
  )
}

export function LeadRowSkeleton() {
  return (
    <div
      className="grid grid-cols-[2.5fr_55px_110px_120px_90px_110px] gap-2.5 items-center px-3.5 py-3 rounded-[8px] mb-0.5"
      style={{ background: 'var(--ax-bg2)', border: '0.5px solid var(--ax-border)' }}
    >
      <div>
        <Skeleton className="h-[13px] w-32 mb-1.5" />
        <Skeleton className="h-[11px] w-24" />
      </div>
      <Skeleton className="h-[22px] w-[22px] rounded-full" />
      <Skeleton className="h-[20px] w-20 rounded-full" />
      <Skeleton className="h-[12px] w-20" />
      <Skeleton className="h-[12px] w-14" />
      <Skeleton className="h-[24px] w-20" />
    </div>
  )
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      {Array.from({ length: rows }).map((_, i) => <LeadRowSkeleton key={i} />)}
    </div>
  )
}
