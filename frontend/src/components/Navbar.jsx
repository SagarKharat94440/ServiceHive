import { Link } from 'react-router-dom';

export default function Navbar({ onLogout }) {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-emerald-600">
          SlotSwapper
        </Link>
        {isLoggedIn && (
          <div className="flex gap-4">
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-emerald-600 font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/marketplace"
              className="text-gray-600 hover:text-emerald-600 font-medium"
            >
              Marketplace
            </Link>
            <Link
              to="/requests"
              className="text-gray-600 hover:text-emerald-600 font-medium"
            >
              Requests
            </Link>
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
