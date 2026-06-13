/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';

export function useWattsonMood({ isTyping, userTyping }) {
  const [mood, setMood] = useState('idle');
  const moodTimeout = useRef(null);
  const wakeTimeout = useRef(null);
  const lastInteractionTime = useRef(0);

  const resetTimer = () => {
    lastInteractionTime.current = Date.now();
    if (mood === 'sleeping' || mood === 'sleepy') {
      setMood('waking');
      if (wakeTimeout.current) clearTimeout(wakeTimeout.current);
      wakeTimeout.current = setTimeout(() => setMood('idle'), 1400);
    }
  };

  // Handle typing states
  useEffect(() => {
    if (isTyping) {
      setMood('thinking');
    } else if (userTyping) {
      setMood('focused');
    } else if (mood === 'thinking' || mood === 'focused') {
      setMood('idle');
    }
  }, [isTyping, userTyping]);

  // Quiet idle states: no movement, only status/personality changes.
  useEffect(() => {
    if (isTyping || userTyping) return undefined;

    const interval = setInterval(() => {
      const idleTime = Date.now() - lastInteractionTime.current;

      if (idleTime > 90000 && mood !== 'sleeping') {
        setMood('sleeping');
      } else if (idleTime > 45000 && idleTime <= 90000 && mood !== 'sleepy' && mood !== 'sleeping') {
        setMood('sleepy');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isTyping, userTyping, mood]);

  // External trigger for mood
  const triggerMood = (newMood, duration = 3000) => {
    lastInteractionTime.current = Date.now();
    setMood(newMood);
    if (moodTimeout.current) clearTimeout(moodTimeout.current);
    if (duration > 0) {
      moodTimeout.current = setTimeout(() => setMood('idle'), duration);
    }
  };

  const triggerAnnoyed = () => {
    setMood('idle');
  };

  return { mood, triggerMood, triggerAnnoyed, resetTimer };
}
