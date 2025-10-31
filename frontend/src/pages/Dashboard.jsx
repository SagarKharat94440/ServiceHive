import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { eventService } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const { data } = await eventService.getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await eventService.createEvent(formData);
      setFormData({ title: '', startTime: '', endTime: '' });
      setShowForm(false);
      fetchEvents();
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  const handleToggleSwappable = async (eventId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'BUSY' ? 'SWAPPABLE' : 'BUSY';
      await eventService.updateEvent(eventId, { status: newStatus });
      fetchEvents();
    } catch (err) {
      console.error('Failed to update event:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Calendar</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            {showForm ? 'Cancel' : 'Add Event'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Team Meeting"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition"
              >
                Create Event
              </button>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">
                No events yet. Create one to get started!
              </p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(event.startTime).toLocaleString()} -{' '}
                    {new Date(event.endTime).toLocaleTimeString()}
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                      event.status === 'SWAPPABLE'
                        ? 'bg-green-100 text-green-800'
                        : event.status === 'SWAP_PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
                {event.status !== 'SWAP_PENDING' && (
                  <button
                    onClick={() => handleToggleSwappable(event._id, event.status)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      event.status === 'BUSY'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    {event.status === 'BUSY' ? 'Make Swappable' : 'Make Busy'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
