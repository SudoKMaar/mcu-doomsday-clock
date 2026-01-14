"use client";

import { useEffect, useState} from "react";

interface TimeLeft {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TARGET_DATE = new Date("December 18, 2026 00:00:00");

function calculateTimeLeft(): TimeLeft | null {
  const now = new Date();
  if (now >= TARGET_DATE) return null;

  let months =
    (TARGET_DATE.getFullYear() - now.getFullYear()) * 12 +
    (TARGET_DATE.getMonth() - now.getMonth());

  if (now.getDate() > TARGET_DATE.getDate()) months--;

  const futureDate = new Date(now);
  futureDate.setMonth(futureDate.getMonth() + months);
  const diff = TARGET_DATE.getTime() - futureDate.getTime();

  return {
    months,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function formatTwoDigits(num: number): string {
  return num < 10 ? "0" + num : "" + num;
}

// Audio tracks
export const AUDIO_TRACKS = {
  THEME: "/avengersdoomsday.mp3",
  TICK: "/Doomsday clock sound effect.mp3",
};

// Export audio control functions
let globalAudio: HTMLAudioElement | null = null;
let currentTrack: string = AUDIO_TRACKS.THEME;

export function getAudio() {
  return globalAudio;
}

export function getCurrentTrack() {
  return currentTrack;
}

export function switchTrack(trackPath: string) {
  if (!globalAudio) return;
  
  const wasPlaying = !globalAudio.paused;
  const wasMuted = globalAudio.muted;
  
  globalAudio.pause();
  globalAudio.src = trackPath;
  currentTrack = trackPath;
  globalAudio.load();
  
  if (wasPlaying) {
    globalAudio.play().catch(() => {});
  }
  globalAudio.muted = wasMuted;
}

export default function Countdown() {
  const [showDate, setShowDate] = useState(true);
  const [time, setTime] = useState<TimeLeft | null>(null);
  const [displayValues, setDisplayValues] = useState({
    months: "00",
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    globalAudio = new Audio("/avengersdoomsday.mp3");
    globalAudio.loop = true;
    globalAudio.volume = 0.3;
    globalAudio.preload = "auto";

    let audioUnlocked = false;

    // Try to play audio (handles both user interaction and autoplay)
    const tryPlayAudio = () => {
      if (!globalAudio || audioUnlocked) return;
      
      globalAudio.play()
        .then(() => {
          audioUnlocked = true;
          // Remove all listeners once audio is playing
          removeListeners();
        })
        .catch(() => {
          // Autoplay blocked, will retry on user interaction
        });
    };

    const removeListeners = () => {
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
      document.removeEventListener("keydown", enableAudio);
      document.removeEventListener("scroll", enableAudio);
    };

    // Enable audio on first user interaction (browser autoplay policy)
    const enableAudio = () => {
      tryPlayAudio();
    };

    document.addEventListener("click", enableAudio);
    document.addEventListener("touchstart", enableAudio);
    document.addEventListener("keydown", enableAudio);
    document.addEventListener("scroll", enableAudio);

    // Wait for audio to be ready
    globalAudio.addEventListener("canplaythrough", () => {
      // Audio is loaded and ready
    });

    const startTimer = setTimeout(() => {
      const initialTime = calculateTimeLeft();
      if (!initialTime) return;

      setShowDate(false);
      setTime(initialTime);

      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const shuffleDuration = 1000;
      const startTime = Date.now();

      const shuffleInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= shuffleDuration) {
          clearInterval(shuffleInterval);
          setDisplayValues({
            months: formatTwoDigits(initialTime.months),
            days: formatTwoDigits(initialTime.days),
            hours: formatTwoDigits(initialTime.hours),
            minutes: formatTwoDigits(initialTime.minutes),
            seconds: formatTwoDigits(initialTime.seconds),
          });
          // Try to play when countdown starts
          tryPlayAudio();
        } else {
          setDisplayValues({
            months: Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join(""),
            days: Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join(""),
            hours: Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join(""),
            minutes: Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join(""),
            seconds: Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join(""),
          });
        }
      }, 50);
    }, 3500);

    return () => {
      clearTimeout(startTimer);
      globalAudio?.pause();
      globalAudio = null;
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
      document.removeEventListener("keydown", enableAudio);
      document.removeEventListener("scroll", enableAudio);
    };
  }, []);

  useEffect(() => {
    if (!time) return;

    const interval = setInterval(() => {
      const newTime = calculateTimeLeft();
      if (newTime) {
        setTime(newTime);
        setDisplayValues({
          months: formatTwoDigits(newTime.months),
          days: formatTwoDigits(newTime.days),
          hours: formatTwoDigits(newTime.hours),
          minutes: formatTwoDigits(newTime.minutes),
          seconds: formatTwoDigits(newTime.seconds),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className="countdown-container absolute top-[57%] left-1/2 -translate-x-1/2 translate-y-[90%] z-10 pointer-events-none whitespace-nowrap flex justify-center items-center opacity-0">
      {/* Static date */}
      <div
        className="absolute font-[var(--font-cinzel)] text-[4vmin] sm:text-[3vmin] font-bold text-white tracking-[1vmin] sm:tracking-[0.5vmin] transition-opacity duration-500"
        style={{ 
          textShadow: "0 0.4vmin 2vmin rgba(255, 255, 255, 0.377)",
          opacity: showDate ? 1 : 0 
        }}
      >
        DECEMBER 18, 2026
      </div>

      {/* Countdown wrapper */}
      <div
        className="flex items-start gap-[1.5vmin] sm:gap-[1vmin] transition-opacity duration-500"
        style={{ opacity: showDate ? 0 : 1 }}
      >
        <TimeBox value={displayValues.months} label="MONTHS" />
        <Separator />
        <TimeBox value={displayValues.days} label="DAYS" />
        <Separator />
        <TimeBox value={displayValues.hours} label="HOURS" />
        <Separator />
        <TimeBox value={displayValues.minutes} label="MINUTES" />
        <Separator />
        <TimeBox value={displayValues.seconds} label="SECONDS" />
      </div>
    </div>
  );
}

function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center relative">
      <span
        className="font-mono text-[3.5vmin] sm:text-[2.5vmin] font-semibold text-white tracking-[0.5vmin] leading-none"
        style={{ textShadow: "0 0.4vmin 1.5vmin rgba(0, 0, 0, 0.8)" }}
      >
        {value}
      </span>
      <span
        className="text-[0.9vmin] sm:text-[0.7vmin] font-bold uppercase text-gray-400 mt-[1vmin] tracking-[0.3vmin]"
        style={{ textShadow: "0 0.2vmin 0.8vmin rgba(0, 0, 0, 1)" }}
      >
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <span
      className="font-mono text-[3vmin] sm:text-[2vmin] text-white font-semibold -mt-[0.3vmin]"
      style={{ textShadow: "0 0.4vmin 1.5vmin rgba(0, 0, 0, 0.8)" }}
    >
      :
    </span>
  );
}
