'use client';

import { useState } from 'react';
import CapsuleVerification from './CapsuleVerification';

interface CapsuleContentProps {
  capsuleId: string;
  isUnlocked: boolean;
  hasQuestion: boolean;
  question: string | null;
  parsedContent: {
    text: string;
    media: string | null;
    mediaType: string | null;
  };
  unlockDate: Date;
  isOwner: boolean;
}

export default function CapsuleContent({
  capsuleId,
  isUnlocked,
  hasQuestion,
  question,
  parsedContent,
  unlockDate,
  isOwner,
}: CapsuleContentProps) {
  const [isVerified, setIsVerified] = useState(!hasQuestion || isOwner);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Client-side countdown update
  useState(() => {
    if (!isUnlocked) {
      const updateCountdown = () => {
        const now = new Date();
        const diff = unlockDate.getTime() - now.getTime();

        if (diff <= 0) {
          window.location.reload();
          return;
        }

        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);

      return () => clearInterval(interval);
    }
  });

  // Show locked view if not unlocked yet
  if (!isUnlocked) {
    return (
      <div className="text-center py-12">
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-yellow-400 animate-pulse"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">🔒 Capsule Locked</h2>
        <p className="text-gray-300 mb-6">This capsule will unlock in:</p>
        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
            <div className="text-gray-300 text-sm">Days</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
            <div className="text-gray-300 text-sm">Hours</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
            <div className="text-gray-300 text-sm">Minutes</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
            <div className="text-gray-300 text-sm">Seconds</div>
          </div>
        </div>
      </div>
    );
  }

  // Show verification if question exists and not verified
  if (hasQuestion && !isVerified) {
    return (
      <CapsuleVerification
        capsuleId={capsuleId}
        question={question!}
        onVerified={() => setIsVerified(true)}
      />
    );
  }

  // Show unlocked content
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-success/30">
      <div className="flex items-center mb-4">
        <svg className="w-8 h-8 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
        </svg>
        <h2 className="text-2xl font-bold text-success">🔓 Capsule Unlocked</h2>
      </div>

      {/* Text Content */}
      {parsedContent.text && (
        <div className="mb-6">
          <p className="text-white whitespace-pre-wrap text-lg leading-relaxed">
            {parsedContent.text}
          </p>
        </div>
      )}

      {/* Media Content - Image */}
      {parsedContent.media && parsedContent.mediaType === 'image' && (
        <div className="mt-4 rounded-lg overflow-hidden border border-white/10">
          <img
            src={parsedContent.media}
            alt="Capsule content"
            className="w-full h-auto max-h-96 object-cover"
          />
        </div>
      )}

      {/* Media Content - Video */}
      {parsedContent.media && parsedContent.mediaType === 'video' && (
        <div className="mt-4 rounded-lg overflow-hidden border border-white/10">
          <video src={parsedContent.media} controls className="w-full h-auto max-h-96">
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
