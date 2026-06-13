let audioContext = null;
const MASTER_VOLUME = 3.1;

const soundPatterns = {
  disable: [
    { frequency: 360, delay: 0, duration: 0.055, type: 'triangle', volume: 0.028 },
    { frequency: 230, delay: 0.055, duration: 0.07, type: 'triangle', volume: 0.022 },
  ],
  enable: [
    { frequency: 520, delay: 0, duration: 0.055, type: 'sine', volume: 0.028 },
    { frequency: 740, delay: 0.06, duration: 0.08, type: 'sine', volume: 0.034 },
  ],
  open: [
    { frequency: 440, delay: 0, duration: 0.045, type: 'sine', volume: 0.024 },
    { frequency: 660, delay: 0.05, duration: 0.06, type: 'sine', volume: 0.03 },
  ],
  reply: [
    { frequency: 620, delay: 0, duration: 0.04, type: 'triangle', volume: 0.022 },
    { frequency: 840, delay: 0.045, duration: 0.055, type: 'triangle', volume: 0.026 },
    { frequency: 720, delay: 0.1, duration: 0.055, type: 'triangle', volume: 0.022 },
  ],
  send: [
    { frequency: 530, delay: 0, duration: 0.045, type: 'sine', volume: 0.024 },
    { frequency: 760, delay: 0.045, duration: 0.055, type: 'sine', volume: 0.026 },
  ],
  wake: [
    { frequency: 480, delay: 0, duration: 0.05, type: 'sine', volume: 0.024 },
    { frequency: 690, delay: 0.055, duration: 0.07, type: 'sine', volume: 0.03 },
  ],
};

function getAudioContext() {
  if (typeof window === 'undefined') return null;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

function playTone(context, tone, startAt) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const endAt = startAt + tone.duration;
  const volume = Math.min(tone.volume * MASTER_VOLUME, 0.14);

  oscillator.type = tone.type;
  oscillator.frequency.setValueAtTime(tone.frequency, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.014);
  gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(endAt + 0.02);
}

export async function playWattsonSound(kind = 'open', enabled = true) {
  if (!enabled) return false;

  const context = getAudioContext();
  if (!context) return false;

  try {
    if (context.state === 'suspended') {
      await context.resume();
    }

    const pattern = soundPatterns[kind] || soundPatterns.open;
    const baseTime = context.currentTime + 0.01;

    pattern.forEach((tone) => {
      playTone(context, tone, baseTime + tone.delay);
    });

    return true;
  } catch (error) {
    console.warn('Wattson sound could not play:', error);
    return false;
  }
}
