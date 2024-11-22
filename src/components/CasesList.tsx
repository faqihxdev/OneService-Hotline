import { MapPinIcon, XMarkIcon, TagIcon, PhoneIcon, CodeBracketIcon } from '@heroicons/react/24/solid';
import { casesAtom, removeCaseAtom } from '../stores/cases';
import { useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';

export function CasesList() {
  const [cases] = useAtom(casesAtom);
  const removeCase = useSetAtom(removeCaseAtom);
  
  // Add state for tracking which cases have expanded JSON view
  const [expandedJsonCases, setExpandedJsonCases] = useState<Set<string>>(new Set());

  const toggleJson = (caseId: string) => {
    setExpandedJsonCases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(caseId)) {
        newSet.delete(caseId);
      } else {
        newSet.add(caseId);
      }
      return newSet;
    });
  };

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
            <div className="flex justify-between items-center text-zinc-300 text-sm mb-2">
              <span>Reported by: {case_.name}</span>
              <div className="flex items-center gap-1">
                <PhoneIcon className="w-3 h-3" />
                <span>{case_.contact}</span>
              </div>
            </div>
            <div className="text-zinc-400 text-sm mb-2 flex items-center gap-1">
              <MapPinIcon className="w-4 h-4 text-red-400" />
              {case_.location} ({case_.postal_code})
            </div>
            <div className="bg-zinc-900 p-2 rounded text-zinc-400 mb-2 text-sm">
              {case_.description}
            </div>
            {/* <div className="text-sm">
              <span className="text-zinc-400">Status:</span>{' '}
              <span className={`${
                case_.status === 'pending' 
                  ? 'bg-amber-900/50 text-amber-300' 
                  : 'bg-emerald-900/50 text-emerald-300'
              } px-2 py-0.5 rounded-full text-xs`}>
                {case_.status}
              </span>
            </div> */}
            <div className="flex justify-between items-center">
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
              
              {/* Add JSON viewer button */}
              <button
                onClick={() => toggleJson(case_.id)}
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <CodeBracketIcon className="w-4 h-4" />
                {expandedJsonCases.has(case_.id) ? 'Hide JSON' : 'Show JSON'}
              </button>
            </div>

            {/* JSON viewer section */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedJsonCases.has(case_.id) ? 'max-h-96 mt-2' : 'max-h-0'
              }`}
            >
              <pre className="bg-zinc-900 p-2 rounded text-xs text-zinc-400 overflow-x-auto">
                {JSON.stringify(case_, null, 2)}
              </pre>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 