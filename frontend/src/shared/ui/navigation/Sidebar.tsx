import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'

interface SidebarItem {
  label: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
}

interface SidebarProps {
  items: SidebarItem[]
  collapsible?: boolean
  defaultCollapsed?: boolean
  className?: string
}

export function Sidebar({
  items,
  collapsible = true,
  defaultCollapsed = false,
  className,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const location = useLocation()

  return (
    <aside
      className={clsx(
        'flex flex-col bg-white border-r border-gray-200 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Collapse Toggle */}
      {collapsible && (
        <div className="flex justify-end p-4 border-b border-gray-200">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={clsx(
                'w-5 h-5 transition-transform',
                isCollapsed && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.href

          return (
            <Link
              key={item.href}
              to={item.href}
              className={clsx(
                'flex items-center rounded-lg transition-colors',
                isCollapsed ? 'justify-center p-3' : 'px-3 py-2 space-x-3',
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon && (
                <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
              )}
              {!isCollapsed && (
                <>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary-600">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
