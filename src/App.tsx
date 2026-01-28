/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import "./App.css";
import idleGif from "./assets/idle.gif";
import workGif from "./assets/work.gif";
import breakGif from "./assets/break.gif";
import closeBtn from "./assets/close.png";
import homeSongFile from "./assets/homeSong.mp3"; 
import breakSongFile from "./assets/breakSong.mp3";

function App() {
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const [timeLeft, setTimeLeft] = useState<number>(WORK_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [text, setText] = useState("");
  const [gifImage, setGifImage] = useState(idleGif);

  const homeAudio = useRef(new Audio(homeSongFile));
  const breakAudio = useRef(new Audio(breakSongFile));

  useEffect(() => {
    homeAudio.current.loop = true;
    breakAudio.current.loop = true;
    homeAudio.current.volume = 0.5;
    breakAudio.current.volume = 0.5;
  }, []);

  useEffect(() => {
    homeAudio.current.pause();
    breakAudio.current.pause();

    if (isRunning) {
      if (isBreak) {
        breakAudio.current.play().catch(() => {});
      } else {
        homeAudio.current.play().catch(() => {});
      }
    }
  }, [isRunning, isBreak]);


  useEffect(() => {
    if (!isRunning) {
      setText(isBreak ? "Ready for a break?" : "Ready to work?");
      return;
    }
    const messages = isBreak ? [
        "Stay hydrated !", "Snacks, maybe?", "I love you <3", "Stretch a bit !"
    ] : [
        "You can do it !", "I believe in you !", "Keep going !", "Stay Focused !"
    ];
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
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const switchMode = (breakMode: boolean) => {
    setIsBreak(breakMode);
    setIsRunning(false);
    setTimeLeft(breakMode ? BREAK_TIME : WORK_TIME);
    setGifImage(idleGif);
  };

  const toggleTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setGifImage(isBreak ? breakGif : workGif);
    } else {
      setIsRunning(false);
      setGifImage(idleGif);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? BREAK_TIME : WORK_TIME);
    setGifImage(idleGif);
  };

  return (
    <div className="home-container drag-region">
      <button className="close-button no-drag" onClick={() => (window as any).electronAPI?.closeApp()}>
        <img src={closeBtn} alt="close" />
      </button>

      <div className="glass-card no-drag">
        <div className="mode-switcher">
          <button className={`mode-btn ${!isBreak ? "active" : ""}`} onClick={() => switchMode(false)}>WORK</button>
          <button className={`mode-btn ${isBreak ? "active" : ""}`} onClick={() => switchMode(true)}>BREAK</button>
        </div>

        <div className="status-area">
          <p className="encouragement-text">{text}</p>
          <h1 className="timer-display">{formatTime(timeLeft)}</h1>
        </div>

        <div className="gif-container">
          <img src={gifImage} alt="status" className="main-gif" />
        </div>

        <div className="controls-footer">
          <button className="primary-btn" onClick={toggleTimer}>
            {isRunning ? "PAUSE" : "START"}
          </button>
          <button className="secondary-btn" onClick={resetTimer}>RESET</button>
        </div>
      </div>
    </div>
  );
}

export default App;