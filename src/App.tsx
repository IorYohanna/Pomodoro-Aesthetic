import { useEffect, useState } from "react";
import "./App.css";
import begging from './assets/begging.jpg';
import bored from './assets/bored.jpg';
import home from './assets/home.jpg';
import breakImg from './assets/breakImg.jpg';
import breakSong from './assets/breakSong.mp3';
import homeSong from './assets/homeSong.mp3';



function App() {
  const WORK_TIME = 25 * 60;

  const [timeLeft, setTimeLeft] = useState<number>(WORK_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [text, setText] = useState("");

  const cheerMessages = [
    "You can do it !",
    "I beleive in you !",
    "You're amazing !",
    "Keep going !",
    "Stay Focused !",
  ];

  const breakMessages = [
    "Stay hydrated !",
    "Snacks, maybe?",
    "Text me !",
    "I love you >3",
    "Strecth your body !",
  ];

  useEffect(() => {
    if (!isRunning) {
      setText("");
      return;
    }

    const messages = isBreak ? breakMessages : cheerMessages;
    let index = 0;

    setText(messages[index]);

    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setText(messages[index]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isRunning, isBreak]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer: ReturnType<typeof setInterval> = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const s = (seconds % 60).toString().padStart(2, "0");

    return `${m}:${s}`;
  };

  const switchMode = (breakMode: boolean) => {
    setIsBreak(breakMode);
    setIsRunning(false);
    setTimeLeft(breakMode ? 5 * 60 : 25 * 60);
  };

  const handleClick = () => {
    setIsRunning((prev) => {
      if (prev) setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
      return !prev;
    });
  };

  return (
    <div className="relative">
      <div>
        <button className="closeButton">Close</button>
      </div>
      <div className="home-content">
        <div className="home-controls">
          <button className="image-button" onClick={() => switchMode(false)}>
            Work
          </button>
          <button className="image-button" onClick={() => switchMode(true)}>
            Break
          </button>
        </div>

        <p className={`encouragement-text ${!isRunning ? "hidden" : ""}`}>
          {text}
        </p>

        <h1 className="home-Timer">{formatTime(timeLeft)}</h1>

        <button className="home-button" onClick={handleClick}>
          {isRunning ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
}

export default App;
