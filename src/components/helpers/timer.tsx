import { useState, useEffect, useRef } from 'react';

// A reusable hook for a countdown timer that persists across tabs and window minimizations.
// It relies on a target end time rather than a fixed interval.
export const usePaymentTimer = (targetTime: Date | null, onFinish: () => void) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Add a guard clause to prevent running if targetTime is null
    if (!targetTime) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setTimeLeft(0);
      return;
    }

    // This function calculates the remaining time in seconds
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTime.getTime() - now;
      return Math.floor(difference / 1000);
    };

    // The timer function that updates the state
    const updateTimer = () => {
      const secondsLeft = calculateTimeLeft();
      if (secondsLeft <= 0) {
        setTimeLeft(0);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        onFinish();
      } else {
        setTimeLeft(secondsLeft);
      }
    };

    // Initial check
    updateTimer();

    // Set a timer to update the countdown every second
    timerRef.current = window.setInterval(updateTimer, 1000);

    // Clean up the timer when the component unmounts
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [targetTime, onFinish]);

  return timeLeft;
};

// --- Example Usage ---

// Helper function to format seconds into a readable string
export const formatTimer = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export const StyledTimerCard = ({ timeLeft }: { timeLeft: number }) => {
    if (timeLeft <= 0) {
      return null;
    }
  
    return (
      <div className="fixed top-4 right-4 z-40">
        <div className="bg-white p-3 rounded-xl shadow-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ef4444" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span className="font-mono text-sm text-gray-800 font-semibold">{formatTimer(timeLeft)}</span>
        </div>
      </div>
    );
  };