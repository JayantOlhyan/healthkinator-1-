// Base64 decoding function
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Raw PCM to AudioBuffer decoding function
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Singleton AudioContext to avoid creating multiple contexts
let audioContext: AudioContext | null = null;
const getAudioContext = (): AudioContext => {
    if (!audioContext || audioContext.state === 'closed') {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return audioContext;
};

// Keep track of the current audio source to allow for interruption
let currentSource: AudioBufferSourceNode | null = null;

// Main playback function
export const playAudio = (base64Audio: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Stop any previously playing audio to prevent overlap
            if (currentSource) {
                currentSource.onended = null; // Remove old listener
                currentSource.stop();
            }
            
            const ctx = getAudioContext();
            if (ctx.state === 'suspended') {
              await ctx.resume();
            }
            
            const audioData = decode(base64Audio);
            const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);
            
            const source = ctx.createBufferSource();
            currentSource = source; // Track the new source
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start();

            source.onended = () => {
                if (currentSource === source) {
                    currentSource = null; // Clear reference when done
                }
                resolve();
            };
        } catch (error) {
            console.error("Error playing audio:", error);
            currentSource = null; // Clear on error too
            reject(error);
        }
    });
};

/**
 * Explicitly stops any currently playing audio.
 */
export const stopAudio = (): void => {
    if (currentSource) {
        try {
            currentSource.onended = null; // Prevent onended from firing (and resolving the promise)
            currentSource.stop();
        } catch (e) {
            // This can throw if the source is not in a valid state to be stopped.
            // It's generally safe to ignore.
            console.warn("Could not stop audio source, it may have already finished.");
        } finally {
            currentSource = null;
        }
    }
};
