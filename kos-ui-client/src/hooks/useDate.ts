import { useEffect, useState } from 'react';

export const useDate = () => {
  // Save the current date to be able to trigger an update
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      // Creates an interval which will update the current data every second
      // This will trigger a rerender every component that uses the useDate hook.
      setDate(new Date());
    }, 1000);
    return () => {
      // Return a funtion to clear the timer so that it will stop being called on unmount
      clearInterval(timer);
    };
  }, []);

  return { date, setDate };
};
