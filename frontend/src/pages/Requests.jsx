import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { swapService } from '../services/api';

export default function Requests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchRequests();
  }, [navigate]);

  const fetchRequests = async () => {
    try {
      const { data } = await swapService.getSwapRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId, response) => {
    try {
      await swapService.respondToSwapRequest(requestId, response);
      fetchRequests();
      alert(`Request ${response.toLowerCase()}!`);
    } catch (err) {
      console.error('Failed to respond to request:', err);
      alert('Failed to respond to request');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Swap Requests</h1>

        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No swap requests yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const isReceived = request.targetUserId.toString() === userId;
              const otherUser = isReceived
                ? request.requester
                : request.target;

              return (
                <div
                  key={request._id}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {isReceived ? 'Received Request' : 'Sent Request'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {isReceived ? 'From' : 'To'}: {otherUser?.name}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : request.status === 'ACCEPTED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {isReceived ? 'Their Slot' : 'Your Slot'}
                      </h4>
                      <p className="text-sm text-gray-700">
                        {isReceived
                          ? request.mySlot?.title
                          : request.mySlot?.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {isReceived
                          ? new Date(
                              request.mySlot?.startTime
                            ).toLocaleString()
                          : new Date(
                              request.mySlot?.startTime
                            ).toLocaleString()}
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {isReceived ? 'Your Slot' : 'Their Slot'}
                      </h4>
                      <p className="text-sm text-gray-700">
                        {isReceived
                          ? request.theirSlot?.title
                          : request.theirSlot?.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {isReceived
                          ? new Date(
                              request.theirSlot?.startTime
                            ).toLocaleString()
                          : new Date(
                              request.theirSlot?.startTime
                            ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {isReceived && request.status === 'PENDING' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleResponse(request._id, 'ACCEPTED')}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleResponse(request._id, 'REJECTED')}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
