import { Outlet, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { AppShell } from '@/widgets/layout'
import { useAuth } from '@/app/providers/AuthProvider'

export function ProtectedLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const dashboardPath = user?.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client'

  const navLinks = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'Gigs', href: '/gigs' },
      { label: 'Projects', href: '/projects' },
      { label: 'Messages', href: '/messages' },
    ],
    []
  )

  const sidebarItems = useMemo(
    () => [
      { label: 'Dashboard', href: dashboardPath },
      { label: 'Gigs', href: '/gigs' },
      { label: 'Projects', href: '/projects' },
      { label: 'Messages', href: '/messages' },
    ],
    [dashboardPath]
  )

  const userMenu = useMemo(
    () => [
      {
        label: 'Dashboard',
        onClick: () => navigate(dashboardPath),
      },
      {
        label: 'Logout',
        variant: 'danger' as const,
        onClick: async () => {
          await logout()
          navigate('/login', { replace: true })
        },
      },
    ],
    [dashboardPath, logout, navigate]
  )

  return (
    <AppShell
      navLinks={navLinks}
      sidebarItems={sidebarItems}
      userName={user?.full_name || user?.email || 'User'}
      userAvatar={user?.avatar_url}
      userMenu={userMenu}
    >
      <Outlet />
    </AppShell>
  )
}
