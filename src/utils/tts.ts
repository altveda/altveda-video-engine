import { delayRender, continueRender } from 'remotion';

const GOOGLE_TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY;

export const fetchVoice = async (text: string): Promise<string> => {
  if (!GOOGLE_TTS_API_KEY) {
    console.warn("GOOGLE_TTS_API_KEY not found. Falling back to silence.");
    return "";
  }

  const handle = delayRender('fetching-voice');
  
  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          input: { text },
          voice: { 
            languageCode: 'en-IN', 
            name: 'en-IN-Wavenet-B', // Premium male neural voice
            ssmlGender: 'MALE' 
          },
          audioConfig: { audioEncoding: 'MP3', pitch: -2.0, speakingRate: 0.95 }
        }),
      }
    );

    const json = await response.json();
    const audioData = json.audioContent;
    const url = `data:audio/mp3;base64,${audioData}`;
    
    continueRender(handle);
    return url;
  } catch (e) {
    console.error("TTS Fetch failed:", e);
    continueRender(handle);
    return "";
  }
};
