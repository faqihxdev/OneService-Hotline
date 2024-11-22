import { WavRecorder } from '../lib/wavtools/index.js';
import { RealtimeClient } from '@openai/realtime-api-beta';

export const formatTime = (startTime: string, timestamp: string): string => {
  const t0 = new Date(startTime).valueOf();
  const t1 = new Date(timestamp).valueOf();
  const delta = t1 - t0;
  const hs = Math.floor(delta / 10) % 100;
  const s = Math.floor(delta / 1000) % 60;
  const m = Math.floor(delta / 60_000) % 60;
  const pad = (n: number): string => {
    let s = n + '';
    while (s.length < 2) {
      s = '0' + s;
    }
    return s;
  };
  return `${pad(m)}:${pad(s)}.${pad(hs)}`;
};

export const resetAPIKey = () => {
  const apiKey = prompt('OpenAI API Key');
  if (apiKey !== null) {
    localStorage.clear();
    localStorage.setItem('tmp::voice_api_key', apiKey);
    window.location.reload();
  }
};

export const handleTurnEndTypeChange = async (
  value: string,
  wavRecorder: WavRecorder,
  client: RealtimeClient,
  setCanPushToTalk: (value: boolean) => void
) => {
  if (value === 'none' && wavRecorder.getStatus() === 'recording') {
    await wavRecorder.pause();
  }
  client.updateSession({
    turn_detection: value === 'none' ? null : { type: 'server_vad' },
  });
  if (value === 'server_vad' && client.isConnected()) {
    await wavRecorder.record((data) => client.appendInputAudio(data.mono));
  }
  setCanPushToTalk(value === 'none');
}; 