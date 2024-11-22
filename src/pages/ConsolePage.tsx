/**
 * Running a local relay server will allow you to hide your API key
 * and run custom logic on the server
 *
 * Set the local relay server address to:
 * REACT_APP_LOCAL_RELAY_SERVER_URL=http://localhost:8081
 *
 * This will also require you to set OPENAI_API_KEY= in a `.env` file
 * You can run it with `npm run relay`, in parallel with `npm start`
 */
const LOCAL_RELAY_SERVER_URL: string =
  process.env.REACT_APP_LOCAL_RELAY_SERVER_URL || '';

import { useEffect, useCallback, useRef, useState } from 'react';

import { ItemType } from '@openai/realtime-api-beta/dist/lib/client';
import { RealtimeClient } from '@openai/realtime-api-beta';
import { WavRecorder, WavStreamPlayer } from '../lib/wavtools/index';
import { instructions } from '../utils/conversation_config';

import { 
  MicrophoneIcon, 
  HashtagIcon, 
  SpeakerWaveIcon,
  PlusIcon,
  VideoCameraIcon,
  UsersIcon,
  XMarkIcon,
  PencilSquareIcon,
  PhoneIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';
import { Button } from '../components/Button';
import { Toggle } from '../components/Toggle';

import { Visualization } from '../components/Visualization';
import { EventLog } from '../components/EventLog';
import { CasesList } from '../components/CasesList';
import { setupTools } from '../utils/tools';
import { formatTime as formatTimeHelper, handleTurnEndTypeChange } from '../utils/helper';
import { ConversationHistory } from '../components/ConversationHistory';
import iPhoneFrame from '../assets/iphone.png';
import osLogo from '../assets/os-logo.png';
import { useAtom, useSetAtom } from 'jotai';
import { addCaseAtom, casesAtom } from '../stores/cases';

/**
 * Type for all event logs
 */
interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: { [key: string]: any };
}

export function ConsolePage() {
  // Initialize refs
  const wavRecorderRef = useRef<WavRecorder>(new WavRecorder({ sampleRate: 24000 }));
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(new WavStreamPlayer({ sampleRate: 24000 }));
  const eventsScrollHeightRef = useRef(0);
  const eventsScrollRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<string>(new Date().toISOString());

  // Initialize state
  const [items, setItems] = useState<ItemType[]>([]);
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<{ [key: string]: boolean }>({});
  const [isConnected, setIsConnected] = useState(false);
  const [canPushToTalk, setCanPushToTalk] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [cases, setCases] = useAtom(casesAtom);
  const addCase = useSetAtom(addCaseAtom);

  // Get API Key
  const apiKey = LOCAL_RELAY_SERVER_URL
    ? ''
    : localStorage.getItem('tmp::voice_api_key') || prompt('OpenAI API Key') || '';
  if (apiKey !== '') {
    localStorage.setItem('tmp::voice_api_key', apiKey);
  }

  // Initialize client
  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient(
      LOCAL_RELAY_SERVER_URL
        ? { url: LOCAL_RELAY_SERVER_URL }
        : {
            apiKey: apiKey,
            dangerouslyAllowAPIKeyInBrowser: true,
          }
    )
  );

  /**
   * Utility for formatting the timing of logs
   */
  const formatTimeFromStart = useCallback((timestamp: string): string => {
    const startTime = startTimeRef.current;
    return formatTimeHelper(startTime, timestamp);
  }, []);

  /**
   * When you click the API key
   */
  const resetAPIKey = useCallback(() => {
    const apiKey = prompt('OpenAI API Key');
    if (apiKey !== null) {
      localStorage.clear();
      localStorage.setItem('tmp::voice_api_key', apiKey);
      window.location.reload();
    }
  }, []);

  /**
   * Connect to conversation
   */
  const connectConversation = useCallback(async () => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    startTimeRef.current = new Date().toISOString();
    setIsConnected(true);
    setRealtimeEvents([]);
    setItems(client.conversation.getItems());
    setCallDuration(0);

    // Start the timer
    timerIntervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    await wavRecorder.begin();
    await wavStreamPlayer.connect();
    await client.connect();
    
    client.sendUserMessageContent([
      {
        type: `input_text`,
        text: `Hello!`,
      },
    ]);

    if (client.getTurnDetectionType() === 'server_vad') {
      await wavRecorder.record((data: { mono: any }) => client.appendInputAudio(data.mono));
    }
  }, [setIsConnected, setRealtimeEvents, setItems]);

  /**
   * Disconnect conversation
   */
  const disconnectConversation = useCallback(async () => {
    setIsConnected(false);
    setRealtimeEvents([]);
    setItems([]);

    // Clear the timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setCallDuration(0);

    const client = clientRef.current;
    client.disconnect();

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.end();

    const wavStreamPlayer = wavStreamPlayerRef.current;
    await wavStreamPlayer.interrupt();
  }, [setIsConnected, setRealtimeEvents, setItems]);

  const deleteConversationItem = useCallback(async (id: string) => {
    const client = clientRef.current;
    client.deleteItem(id);
  }, []);

  /**
   * Start recording
   */
  const startRecording = async () => {
    setIsRecording(true);
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const trackSampleOffset = await wavStreamPlayer.interrupt();
    if (trackSampleOffset?.trackId) {
      const { trackId, offset } = trackSampleOffset;
      await client.cancelResponse(trackId, offset);
    }
    await wavRecorder.record((data: { mono: any }) => client.appendInputAudio(data.mono));
  };

  /**
   * Stop recording
   */
  const stopRecording = async () => {
    setIsRecording(false);
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.pause();
    client.createResponse();
  };

  /**
   * Switch between Manual <> VAD mode for communication
   */
  const changeTurnEndType = (value: string) => {
    handleTurnEndTypeChange(
      value,
      wavRecorderRef.current,
      clientRef.current,
      setCanPushToTalk
    );
  };

  /**
   * Auto-scroll the event logs
   */
  useEffect(() => {
    if (eventsScrollRef.current) {
      const eventsEl = eventsScrollRef.current;
      const scrollHeight = eventsEl.scrollHeight;
      // Only scroll if height has just changed
      if (scrollHeight !== eventsScrollHeightRef.current) {
        eventsEl.scrollTop = scrollHeight;
        eventsScrollHeightRef.current = scrollHeight;
      }
    }
  }, [realtimeEvents]);

  /**
   * Auto-scroll the conversation logs
   */
  useEffect(() => {
    const conversationEls = [].slice.call(
      document.body.querySelectorAll('[data-conversation-content]')
    );
    for (const el of conversationEls) {
      const conversationEl = el as HTMLDivElement;
      conversationEl.scrollTop = conversationEl.scrollHeight;
    }
  }, [items]);

  /**
   * Core RealtimeClient and audio capture setup
   * Set all of our instructions, tools, events and more
   */
  useEffect(() => {
    const client = clientRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    // Set up client configuration
    client.updateSession({ instructions });
    client.updateSession({ input_audio_transcription: { model: 'whisper-1' } });

    // Set up tools with direct state setters
    setupTools(
      client,
      addCase
    );

    // handle realtime events from client + server for event logging
    client.on('realtime.event', (realtimeEvent: RealtimeEvent) => {
      setRealtimeEvents((prevEvents: RealtimeEvent[]) => {
        const lastEvent = prevEvents[prevEvents.length - 1];
        if (lastEvent?.event.type === realtimeEvent.event.type) {
          lastEvent.count = (lastEvent.count || 0) + 1;
          return prevEvents.slice(0, -1).concat(lastEvent);
        } else {
          return prevEvents.concat(realtimeEvent);
        }
      });
    });
    client.on('error', (event: any) => console.error(event));
    client.on('conversation.interrupted', async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });
    client.on('conversation.updated', async ({ item, delta }: any) => {
      const items = client.conversation.getItems();
      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }
      if (item.status === 'completed' && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }
      setItems(items);
    });

    setItems(client.conversation.getItems());

    return () => {
      // cleanup; resets to defaults
      client.reset();
    };
  }, []);

  // Add these event handlers after your existing handlers
  const handleKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat && isConnected && canPushToTalk && !isRecording) {
        event.preventDefault(); // Prevent page scrolling
        await startRecording();
      }
    },
    [isConnected, canPushToTalk, isRecording, startRecording]
  );

  const handleKeyUp = useCallback(
    async (event: KeyboardEvent) => {
      if (event.code === 'Space' && isConnected && canPushToTalk && isRecording) {
        event.preventDefault();
        await stopRecording();
      }
    },
    [isConnected, canPushToTalk, isRecording, stopRecording]
  );

  // Add this useEffect to set up the keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Add this helper function to format the time
  const formatCallDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  /**
   * Render the application
   */
  return (
    <div className="font-primary font-normal text-xs h-full flex flex-col p-6 overflow-hidden bg-zinc-950" data-component="ConsolePage">

      {/* Main content area */}
      <div className="flex-grow flex flex-shrink overflow-hidden space-x-4">
        
        {/* Left panel */}
        <div className="w-1/3 flex flex-col overflow-hidden space-y-4">
          {/* Events section - 1/3 height */}
          <div className="relative flex flex-col h-1/3 w-full p-4 pr-0 bg-zinc-900 rounded-2xl overflow-hidden">
            <Visualization 
              wavRecorder={wavRecorderRef.current}
              wavStreamPlayer={wavStreamPlayerRef.current}
            />
            <div className="flex w-fit items-center justify-center leading-8 px-4 py-1 mb-4 bg-zinc-800 text-zinc-300 rounded-[1000px] min-h-[32px] z-[9999] text-center whitespace-pre">
              EVENTS
            </div>
            <div ref={eventsScrollRef} className="flex-grow overflow-y-auto overflow-x-hidden text-zinc-300">
              <EventLog 
                events={realtimeEvents}
                expandedEvents={expandedEvents}
                setExpandedEvents={setExpandedEvents}
                formatTime={formatTimeFromStart}
              />
            </div>
          </div>

          {/* Conversation history with controls - 2/3 height */}
          <div className="flex flex-col h-2/3 w-full bg-zinc-900 rounded-2xl overflow-hidden">
            {/* Conversation content */}
            <div className="flex flex-col flex-grow overflow-hidden">
              <ConversationHistory 
                items={items}
                onDeleteItem={deleteConversationItem}
              />
            </div>

            {/* Control buttons in lighter box */}
            <div className="flex-shrink-0 bg-zinc-800 p-4">
              <div className="flex items-center justify-center gap-4">
                <Toggle
                  defaultValue={false}
                  labels={['manual', 'vad']}
                  values={['none', 'server_vad']}
                  onChange={(_, value) => changeTurnEndType(value)}
                />
                <div className="flex-grow" />
                {isConnected && canPushToTalk && (
                  <Button
                    label={isRecording ? 'Recording...' : 'Connected'}
                    buttonStyle={isRecording ? 'alert' : 'regular'}
                    disabled={!isConnected || !canPushToTalk}
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                  />
                )}
              </div>
            </div>
          </div>
        </div>


        {/* Middle panel */}
        <div className="w-1/3 flex flex-col overflow-hidden rounded-2xl bg-zinc-900 p-4">
          {/* iPhone container with relative positioning */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* iPhone frame image */}
            <img 
              src={iPhoneFrame} 
              alt="iPhone frame" 
              className="h-full object-contain"
            />
            
            {/* Call interface overlay */}
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
              <div className="flex flex-col items-center w-full space-y-12">
                {/* Caller info */}
                <div className="text-white text-center mb-20">
                  <div className="text-3xl font-semibold mb-1">One Service Hotline</div>
                  <div className="text-gray-300 text-xl">
                    {isConnected 
                      ? formatCallDuration(callDuration)
                      : 'press to call'
                    }
                  </div>
                </div>

                {/* Call controls */}
                <div className="max-w-[350px] w-full mx-auto">
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {/* Top row buttons */}
                    <button className="flex flex-col items-center cursor-default">
                      <div className="w-[75px] h-[75px] rounded-full bg-white/10 flex items-center justify-center mb-2">
                        <MicrophoneIcon className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-white text-xs">mute</span>
                    </button>
                    
                    <button className="flex flex-col items-center cursor-default">
                      <div className="w-[75px] h-[75px] rounded-full bg-white/10 flex items-center justify-center mb-2">
                        <HashtagIcon className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-white text-xs">keypad</span>
                    </button>
                    
                    <button className="flex flex-col items-center cursor-default">
                      <div className="w-[75px] h-[75px] rounded-full bg-white/10 flex items-center justify-center mb-2">
                        <SpeakerWaveIcon className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-white text-xs">audio</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {/* Bottom row buttons */}
                    <button className="flex flex-col items-center cursor-default">
                      <div className="w-[75px] h-[75px] rounded-full bg-white/10 flex items-center justify-center mb-2">
                        <PlusIcon className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-white text-xs">add call</span>
                    </button>
                    
                    <button className="flex flex-col items-center cursor-default">
                      <div className="w-[75px] h-[75px] rounded-full bg-white/10 flex items-center justify-center mb-2">
                        <VideoCameraIcon className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-white text-xs">FaceTime</span>
                    </button>
                    
                    <button className="flex flex-col items-center cursor-default">
                      <div className="w-[75px] h-[75px] rounded-full bg-white/10 flex items-center justify-center mb-2">
                        <UsersIcon className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-white text-xs">contacts</span>
                    </button>
                  </div>

                  {/* Call/End call button */}
                  <div className="mt-12 flex justify-center">
                    <button 
                      onClick={isConnected ? disconnectConversation : connectConversation}
                      className={`w-[75px] h-[75px] rounded-full ${
                        isConnected ? 'bg-red-500' : 'bg-green-500'
                      } flex items-center justify-center`}
                    >
                      {isConnected ? (
                        <XMarkIcon className="w-8 h-8 text-white" />
                      ) : (
                        <PhoneIcon className="w-8 h-8 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-1/3 flex flex-col space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-12 w-12 bg-white rounded-full">
                <img 
                  src={osLogo} 
                  alt="OS Logo" 
                  className="h-10 w-auto"
                />
              </div>
              <h1 className="text-zinc-300 text-lg font-medium">One Service Hotline</h1>
            </div>
            {!LOCAL_RELAY_SERVER_URL && (
              <Button
                icon={PencilSquareIcon}
                iconPosition="end"
                buttonStyle="flush"
                label={`api key: ${apiKey.slice(0, 3)}...`}
                onClick={() => resetAPIKey()}
                className="flex justify-center items-center text-zinc-300 space-x-2 bg-zinc-800 rounded-[1000px] px-4 py-3"
              />
            )}
          </div>
          
          {/* Cases list */}
          <div className="h-full bg-zinc-900 rounded-2xl overflow-hidden relative flex flex-col">
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-4">
              <div className="flex items-center justify-center leading-8 px-4 py-1 bg-zinc-800 text-zinc-300 rounded-[1000px] min-h-[32px] w-fit">
                CASES
              </div>
              {cases.length > 0 && (
                <button
                  onClick={() => setCases([])}
                  className="px-4 py-2 text-center bg-zinc-800 text-zinc-300 rounded-[1000px] hover:bg-zinc-700 transition-colors flex items-center gap-2"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  <span className="mt-0.5">Clear All</span>
                </button>
              )}
            </div>
            <div className="flex-grow overflow-y-auto">
              <CasesList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
