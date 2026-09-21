import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatient, addMedicalHistory } from '../api/patients';

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Medical history form state
  const [historyNote, setHistoryNote] = useState('');
  const [submittingHistory, setSubmittingHistory] = useState(false);
  const [historyError, setHistoryError] = useState('');

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const data = await getPatient(id);
      setPatient(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch patient details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const handleHistorySubmit = async (e) => {
    e.preventDefault();
    if (!historyNote.trim()) return;

    setSubmittingHistory(true);
    setHistoryError('');

    try {
      const updatedPatient = await addMedicalHistory(id, { note: historyNote });
      setPatient(updatedPatient);
      setHistoryNote('');
    } catch (err) {
      setHistoryError(err.response?.data?.message || 'Failed to add medical history');
    } finally {
      setSubmittingHistory(false);
    }
  };

  if (loading && !patient) {
    return <div className="p-8 text-center text-gray-500">Loading patient details...</div>;
  }

  if (error || !patient) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error || 'Patient not found'}
        </div>
        <Link to="/patients" className="inline-block mt-4 text-blue-600 hover:underline">
          &larr; Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Patient Details</h1>
        <div className="space-x-4">
          <Link
            to={`/patients/${patient._id}/edit`}
            className="text-indigo-600 hover:text-indigo-900 font-medium bg-indigo-50 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors"
          >
            Edit Patient
          </Link>
          <Link to="/patients" className="text-gray-600 hover:text-gray-900 font-medium">
            &larr; Back to List
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
            <p className="mt-1 text-lg text-gray-900">{patient.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Age / Gender</h3>
            <p className="mt-1 text-lg text-gray-900">{patient.age} years / {patient.gender}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
            <p className="mt-1 text-lg text-gray-900">{patient.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Registered By</h3>
            <p className="mt-1 text-lg text-gray-900">
              {patient.registeredBy?.name || 'Unknown'} 
            </p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <p className="mt-1 text-lg text-gray-900 whitespace-pre-wrap">{patient.address}</p>
          </div>
          <div className="md:col-span-2">
             <h3 className="text-sm font-medium text-gray-500">Registered On</h3>
             <p className="mt-1 text-sm text-gray-600">
               {new Date(patient.createdAt).toLocaleString()}
             </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Medical History</h2>
        
        {/* Timeline */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
            <div className="space-y-6">
              {patient.medicalHistory.map((history, index) => (
                <div key={history._id || index} className="relative pl-6 border-l-2 border-blue-200 last:border-l-0 last:pb-0">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1"></div>
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(history.date).toLocaleString()}
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md text-gray-800 whitespace-pre-wrap">
                    {history.note}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No medical history records found.</p>
          )}
        </div>

        {/* Add History Form */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h3 className="text-lg font-medium text-blue-900 mb-3">Add New Record</h3>
          {historyError && (
            <div className="text-red-600 text-sm mb-3">{historyError}</div>
          )}
          <form onSubmit={handleHistorySubmit}>
            <textarea
              rows="3"
              required
              placeholder="Enter doctor's diagnosis, prescription, or notes..."
              value={historyNote}
              onChange={(e) => setHistoryNote(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            ></textarea>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingHistory || !historyNote.trim()}
                className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submittingHistory ? 'Saving...' : 'Add Record'}
              </button>
            </div>
          </form>
          <p className="text-xs text-gray-500 mt-2">Note: Only users with the Doctor role can add medical history.</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
