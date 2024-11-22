import { useRef } from 'react';
import { ArrowUp, ArrowDown } from 'react-feather';
import { RealtimeEvent } from '../types';

interface EventLogProps {
  events: RealtimeEvent[];
  expandedEvents: { [key: string]: boolean };
  setExpandedEvents: (events: { [key: string]: boolean }) => void;
  formatTime: (timestamp: string) => string;
}

export function EventLog({ events, expandedEvents, setExpandedEvents, formatTime }: EventLogProps) {
  const eventsScrollRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={eventsScrollRef}>
      {!events.length && `awaiting connection...`}
      {events.map((realtimeEvent) => {
        const count = realtimeEvent.count;
        const event = { ...realtimeEvent.event };
        if (event.type === 'input_audio_buffer.append') {
          event.audio = `[trimmed: ${event.audio.length} bytes]`;
        } else if (event.type === 'response.audio.delta') {
          event.delta = `[trimmed: ${event.delta.length} bytes]`;
        }
        return (
          <div className="rounded whitespace-pre flex p-0 gap-4" key={event.event_id}>
            <div className="text-left gap-2 py-1 px-0 w-20 flex-shrink-0 mr-4">
              {formatTime(realtimeEvent.time)}
            </div>
            <div className="flex flex-col text-zinc-800 gap-2">
              <div
                className="py-1 px-2 -mx-2 cursor-pointer flex gap-2 items-center hover:bg-zinc-800 hover:rounded-lg"
                onClick={() => {
                  const id = event.event_id;
                  const expanded = { ...expandedEvents };
                  if (expanded[id]) {
                    delete expanded[id];
                  } else {
                    expanded[id] = true;
                  }
                  setExpandedEvents(expanded);
                }}
              >
                <div
                  className={`flex-shrink-0 flex items-center gap-2 ${
                    event.type === 'error' 
                      ? 'text-red-400' 
                      : realtimeEvent.source === 'client'
                      ? 'text-blue-400'
                      : 'text-green-400'
                  }`}
                >
                  {realtimeEvent.source === 'client' ? (
                    <ArrowUp className="stroke-[3] w-3 h-3" />
                  ) : (
                    <ArrowDown className="stroke-[3] w-3 h-3" />
                  )}
                  <span>
                    {event.type === 'error' ? 'error!' : realtimeEvent.source}
                  </span>
                </div>
                <div className="event-type text-zinc-500">
                  {event.type}
                  {count && ` (${count})`}
                </div>
              </div>
              {!!expandedEvents[event.event_id] && (
                <div className="event-payload text-zinc-500">
                  {JSON.stringify(event, null, 2)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
} 