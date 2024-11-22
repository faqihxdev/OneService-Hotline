import { MapPinIcon, XMarkIcon, TagIcon } from '@heroicons/react/24/solid';
import { casesAtom, removeCaseAtom } from '../stores/cases';
import { useAtom, useSetAtom } from 'jotai';

export function CasesList() {
  const [cases] = useAtom(casesAtom);
  const removeCase = useSetAtom(removeCaseAtom);
  
  return (
    <div className="px-4">
      {cases.length === 0 ? (
        <div className="text-zinc-400 italic text-center">No cases recorded</div>
      ) : (
        cases.map((case_) => (
          <div key={case_.id} className="bg-zinc-800 mb-4 p-4 rounded-2xl last:mb-0 relative group">
            {/* Delete button */}
            <button
              onClick={() => removeCase(case_.id)}
              className="absolute top-2 right-2 p-1 bg-zinc-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XMarkIcon className="w-4 h-4 text-zinc-300" />
            </button>
            
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-semibold">{case_.category}</span>
              </div>
              <span className="text-zinc-400 text-xs">
                {new Date(case_.case_datetime).toLocaleString()}
              </span>
            </div>
            <div className="text-zinc-400 text-sm mb-2 flex items-center gap-1">
              <MapPinIcon className="w-4 h-4 text-red-400" />
              {case_.location} ({case_.postal_code})
            </div>
            <div className="bg-zinc-900 p-2 rounded text-zinc-400 mb-2 text-sm">
              {case_.description}
            </div>
            <div className="text-sm">
              <span className="text-zinc-400">Status:</span>{' '}
              <span className={`${
                case_.status === 'pending' 
                  ? 'bg-amber-900/50 text-amber-300' 
                  : 'bg-emerald-900/50 text-emerald-300'
              } px-2 py-0.5 rounded-full text-xs`}>
                {case_.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 