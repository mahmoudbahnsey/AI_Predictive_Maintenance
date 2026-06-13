import { useEffect, useRef } from 'react';

export default function WattsonPresenceController({ 
  mood, 
  triggerMood, 
  resetTimer, 
  onEyeMovement 
}) {
  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  // natural eye tracking mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      resetTimer();

      if (onEyeMovement) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate relative coordinates from center (-1 to 1)
        const dx = (e.clientX - viewportWidth / 2) / (viewportWidth / 2);
        const dy = (e.clientY - viewportHeight / 2) / (viewportHeight / 2);
        
        // Map to slight eye offset angles
        onEyeMovement({ x: dx * 4, y: dy * 3 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [resetTimer, onEyeMovement]);

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

  return null; // pure controller, no UI
}
