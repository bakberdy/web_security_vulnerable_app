import { useAuth } from '@/app/providers/AuthProvider';
import { Button } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';

export function TasksPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {user?.email}
            </span>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Task management coming in Phase 3...</p>
        </div>
      </div>
    </div>
  );
}
