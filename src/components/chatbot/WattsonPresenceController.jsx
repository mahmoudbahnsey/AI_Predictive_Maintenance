import { useEffect, useRef } from 'react';

export default function WattsonPresenceController({ 
  mood, 
  triggerMood, 
  resetTimer, 
  onEyeMovement 
}) {
  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  // natural eye tracking mouse movement — only while awake / monitoring
  useEffect(() => {
    const handleMouseMove = (e) => {
      resetTimer();

      if (mood === 'sleeping' || mood === 'sleepy') {
        // Let him sleep: force sleepy/closed eyes, no active tracking
        if (onEyeMovement) {
          onEyeMovement({ x: 0, y: 2.8, blink: true });
        }
        return;
      }

      if (onEyeMovement) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate relative coordinates from center (-1 to 1)
        const dx = (e.clientX - viewportWidth / 2) / (viewportWidth / 2);
        const dy = (e.clientY - viewportHeight / 2) / (viewportHeight / 2);
        
        // Map to slight eye offset angles — keep an eye on the user
        onEyeMovement({ x: dx * 4.5, y: dy * 3.2 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [resetTimer, onEyeMovement, mood]);

  // Click tracking to trigger "annoyed" mood on spam clicks
  useEffect(() => {
    const handleClick = () => {
      resetTimer();
      clickCount.current += 1;

      if (clickTimer.current) clearTimeout(clickTimer.current);

      if (clickCount.current >= 5) {
        triggerMood('annoyed', 3000);
        clickCount.current = 0;
      } else {
        clickTimer.current = setTimeout(() => {
          clickCount.current = 0;
        }, 1500);
      }
    };

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
      if (clickTimer.current) clearTimeout(clickTimer.current);
    };
  }, [resetTimer, triggerMood]);

  // Natural blinking behavior loop
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (mood === 'sleeping' || mood === 'sleepy') return;
      
      // trigger short blink/focused state
      if (Math.random() > 0.4) {
        onEyeMovement?.({ x: 0, y: 0, blink: true });
        setTimeout(() => {
          onEyeMovement?.({ x: 0, y: 0, blink: false });
        }, 150);
      }
    }, 4000);

    return () => clearInterval(blinkInterval);
  }, [mood, onEyeMovement]);

  // Keep an eye on him while awake: subtle random monitoring glances even without mouse movement
  useEffect(() => {
    if (mood === 'sleeping' || mood === 'sleepy') return undefined;

    const monitorInterval = setInterval(() => {
      // occasional glance to simulate active monitoring / staying alert
      if (Math.random() > 0.65 && onEyeMovement) {
        const glanceX = (Math.random() - 0.5) * 2.2;
        const glanceY = (Math.random() - 0.5) * 1.6;
        onEyeMovement({ x: glanceX, y: glanceY });

        setTimeout(() => {
          onEyeMovement({ x: 0, y: 0 });
        }, 650);
      }
    }, 7500);

    return () => clearInterval(monitorInterval);
  }, [mood, onEyeMovement]);

  return null; // pure controller, no UI
}
