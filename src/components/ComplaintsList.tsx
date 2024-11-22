import { MapPinIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { complaintsAtom, removeComplaintAtom } from '../stores/complaints';
import { useAtom, useSetAtom } from 'jotai';

export function ComplaintsList() {
  const [complaints] = useAtom(complaintsAtom);
  const removeComplaint = useSetAtom(removeComplaintAtom);
  
  return (
    <div className="px-4">
      {complaints.length === 0 ? (
        <div className="text-zinc-400 italic text-center">No complaints recorded</div>
      ) : (
        complaints.map((complaint) => (
          <div key={complaint.id} className="bg-zinc-800 mb-4 p-4 rounded-2xl last:mb-0 relative group">
            {/* Delete button */}
            <button
              onClick={() => removeComplaint(complaint.id)}
              className="absolute top-2 right-2 p-1 bg-zinc-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XMarkIcon className="w-4 h-4 text-zinc-300" />
            </button>
            
            <div className="flex justify-between items-center mb-2">
              <span className="complaint-name">
                <span className="text-green-400 font-semibold">{complaint.name}</span>
              </span>
              <span className="text-zinc-400 text-xs">
                {new Date(complaint.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="text-zinc-400 text-sm mb-2 flex items-center gap-1">
              <MapPinIcon className="w-4 h-4 text-red-400" />
              {complaint.location}
            </div>
            <div className="bg-zinc-900 p-2 rounded text-zinc-400 mb-2 text-sm">
              {complaint.complaint}
            </div>
            <div className="text-sm">
              <span className="text-zinc-400">Status:</span>{' '}
              <span className={`${
                complaint.status === 'pending' 
                  ? 'bg-amber-900/50 text-amber-300' 
                  : 'bg-emerald-900/50 text-emerald-300'
              } px-2 py-0.5 rounded-full text-xs`}>
                {complaint.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 