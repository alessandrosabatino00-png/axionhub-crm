'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme-provider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      onClick={toggleTheme}
      aria-label="Cambia tema"
      className="relative inline-flex items-center w-[52px] h-[28px] rounded-full transition-colors duration-300 flex-shrink-0"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(26,79,214,0.25), rgba(10,189,212,0.15))'
          : 'rgba(15,23,42,0.08)',
        border: `0.5px solid var(--ax-border-strong)`,
      }}
    >
      <span
        className="absolute top-[2px] left-[2px] w-[22px] h-[22px] rounded-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: isDark ? 'translateX(0px)' : 'translateX(24px)',
          background: isDark
            ? 'linear-gradient(135deg, var(--ax-blue), var(--ax-cyan))'
            : 'linear-gradient(135deg, #FBBF24, #F59E0B)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
      >
        {isDark
          ? <Moon size={12} color="white" strokeWidth={2.2} />
          : <Sun size={12} color="white" strokeWidth={2.2} />
        }
      </span>
    </button>
  )
}
