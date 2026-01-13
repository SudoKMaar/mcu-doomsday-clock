"use client";

import { useState, useEffect } from "react";
import { getAudio } from "./Countdown";
import { setWillReturnEnabled, getWillReturnEnabled } from "./WillReturn";

interface UtilityButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}

function UtilityButton({ icon, label, onClick, href }: UtilityButtonProps) {
  const baseClass =
    "p-2 rounded-md text-white/40 hover:bg-white/10 hover:text-white/80 transition-all duration-200 cursor-pointer";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={baseClass}
      >
        {icon}
      </a>
    );
  }

  return (
    <button onClick={onClick} aria-label={label} className={baseClass}>
      {icon}
    </button>
  );
}

// Doctor Doom Mask Icon
const DoomIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    {/* Hood outline */}
    <path d="M12 2C7 2 4 6 4 10v8c0 2 2 4 4 4h8c2 0 4-2 4-4v-8c0-4-3-8-8-8z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    {/* Face plate */}
    <path d="M7 8h10v10c0 1-1 2-2 2H9c-1 0-2-1-2-2V8z" opacity="0.3"/>
    {/* Eye slits */}
    <rect x="8" y="10" width="2.5" height="1" rx="0.5"/>
    <rect x="13.5" y="10" width="2.5" height="1" rx="0.5"/>
    {/* Mouth grill lines */}
    <line x1="9" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="0.75"/>
    <line x1="9" y1="15.5" x2="15" y2="15.5" stroke="currentColor" strokeWidth="0.75"/>
    <line x1="9" y1="17" x2="15" y2="17" stroke="currentColor" strokeWidth="0.75"/>
    {/* Rivets */}
    <circle cx="7" cy="12" r="0.5"/>
    <circle cx="17" cy="12" r="0.5"/>
  </svg>
);

const VolumeOnIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6 9H4a1 1 0 00-1 1v4a1 1 0 001 1h2l4 4V5L6 9z" />
  </svg>
);

const VolumeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const PortfolioIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TextOnIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const TextOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export default function UtilityBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [textEnabled, setTextEnabled] = useState(true);

  const toggleMute = () => {
    const audio = getAudio();
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(audio.muted);
    }
  };

  const toggleText = () => {
    const newState = !textEnabled;
    setTextEnabled(newState);
    setWillReturnEnabled(newState);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2">
      {/* Expandable Menu */}
      <div
        className={`flex flex-col gap-1 rounded-lg bg-black/30 backdrop-blur-sm p-1 transition-all duration-300 overflow-hidden ${
          isOpen ? "opacity-100 translate-y-0 max-h-[300px]" : "opacity-0 translate-y-4 max-h-0 p-0"
        }`}
      >
        <UtilityButton
          icon={isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
          label={isMuted ? "Unmute" : "Mute"}
          onClick={toggleMute}
        />
        <UtilityButton
          icon={textEnabled ? <TextOnIcon /> : <TextOffIcon />}
          label={textEnabled ? "Hide Text" : "Show Text"}
          onClick={toggleText}
        />
        <UtilityButton
          icon={<GitHubIcon />}
          label="GitHub"
          href="https://github.com/SudoKMaar/mcu-doomsday-clock"
        />
        <UtilityButton
          icon={<LinkedInIcon />}
          label="LinkedIn"
          href="https://www.linkedin.com/in/AbhishekKMaar/"
        />
        <UtilityButton
          icon={<PortfolioIcon />}
          label="Portfolio"
          href="https://kmaar.vercel.app/"
        />
      </div>

      {/* Doom Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className={`p-3 rounded-full bg-black/30 backdrop-blur-sm text-white/30 hover:text-white/70 hover:bg-black/50 transition-all duration-300 cursor-pointer ${
          isOpen ? "rotate-180" : ""
        }`}
      >
        {isOpen ? <CloseIcon /> : <DoomIcon />}
      </button>
    </div>
  );
}
