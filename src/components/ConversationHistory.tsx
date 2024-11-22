import { XMarkIcon } from '@heroicons/react/24/solid';
import { ItemType } from '@openai/realtime-api-beta/dist/lib/client';
import { useEffect, useRef } from 'react';

interface ConversationHistoryProps {
  items: ItemType[];
  onDeleteItem: (id: string) => void;
}

export function ConversationHistory({ items, onDeleteItem }: ConversationHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when items change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [items]);

  return (
    <div className="flex flex-col max-h-full w-full flex-grow text-zinc-300 pl-4 pt-4">
      <div className="flex w-fit items-center justify-center leading-8 px-4 py-1 mb-4 bg-zinc-800 text-zinc-300 rounded-[1000px] min-h-[32px] z-[9999] text-center whitespace-pre">
        CONVERSATION HISTORY
      </div>
      <div ref={scrollRef} className='flex-grow overflow-y-auto'>
        <div data-conversation-content>
          
          {/* Dummy list of items to make the conversation content scrollable */}
          {/* {Array.from({ length: 100 }).map((_, index) => (
            <div key={index} className="h-10 bg-zinc-800">
              {index}
            </div>
          ))} */}
  
          {!items.length && `awaiting connection...`}
          {items.map((conversationItem: ItemType) => (
            <div className="relative flex gap-4 mb-4 group" key={conversationItem.id}>
              <div className={`relative text-left gap-4 w-20 flex-shrink-0 mr-4 ${
                conversationItem.role === 'user' 
                  ? 'text-blue-400' 
                  : conversationItem.role === 'assistant' 
                  ? 'text-green-400' 
                  : ''
              }`}>
                <div>
                  {(conversationItem.role || conversationItem.type).replaceAll('_', ' ')}
                </div>
                <div
                  className="absolute top-0 -right-5 bg-zinc-800 text-white flex rounded-2xl p-0.5 cursor-pointer group-hover:flex hover:bg-zinc-950"
                  onClick={() => onDeleteItem(conversationItem.id)}
                >
                  <XMarkIcon className="w-3 h-3" />
                </div>
              </div>
              <div className="text-zinc-500 overflow-hidden break-words">
                {/* tool response */}
                {conversationItem.type === 'function_call_output' && (
                  <div>{conversationItem.formatted.output}</div>
                )}
                {/* tool call */}
                {!!conversationItem.formatted.tool && (
                  <div>
                    {conversationItem.formatted.tool.name}(
                    {conversationItem.formatted.tool.arguments})
                  </div>
                )}
                {!conversationItem.formatted.tool &&
                  conversationItem.role === 'user' && (
                    <div>
                      {conversationItem.formatted.transcript ||
                        (conversationItem.formatted.audio?.length
                          ? '(awaiting transcript)'
                          : conversationItem.formatted.text ||
                            '(item sent)')}
                    </div>
                  )}
                {!conversationItem.formatted.tool &&
                  conversationItem.role === 'assistant' && (
                    <div>
                      {conversationItem.formatted.transcript ||
                        conversationItem.formatted.text ||
                        '(truncated)'}
                    </div>
                  )}
                {conversationItem.formatted.file && (
                  <audio
                    className='mt-2 custom-audio'
                    src={conversationItem.formatted.file.url}
                    controls
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 