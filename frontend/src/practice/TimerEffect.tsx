import { useState, useEffect } from "react";

export const TimerEffect: React.FC<{
  setIsDisplay: (value: React.SetStateAction<boolean>) => void;
}> = ({ setIsDisplay }) => {
  const [count, setCount] = useState(10);

  useEffect(() => {
    console.log("再レンダー");
    if (count < 0) {
      setIsDisplay(false);
      return;
    }

    setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);
  }, [count, setIsDisplay])

  return (
    <p>{count}秒後にunMountします</p>
  )
}