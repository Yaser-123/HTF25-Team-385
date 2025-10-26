'use client';

import { useState, useEffect } from 'react';
import CapsuleVerification from './CapsuleVerification';
import MediaCarousel from './MediaCarousel';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

interface CapsuleContentProps {
  capsuleId: string;
  isUnlocked: boolean;
  hasQuestion: boolean;
  question: string | null;
  parsedContent: {
    text: string;
    media: MediaItem[];
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
  const [showCarousel, setShowCarousel] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Client-side countdown update
  useEffect(() => {
    if (!isUnlocked && typeof window !== 'undefined') {
      const updateCountdown = () => {
        const now = new Date();
        const diff = unlockDate.getTime() - now.getTime();

        if (diff <= 0) {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
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
  }, [isUnlocked, unlockDate]);

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

      {/* Media Content - Single Thumbnail with Badge */}
      {parsedContent.media && parsedContent.media.length > 0 && (
        <div className="mt-6">
          <div
            className="relative w-full aspect-video rounded-lg overflow-hidden cursor-pointer group border border-success/30"
            onClick={() => {
              setCarouselIndex(0);
              setShowCarousel(true);
            }}
          >
            {/* First Media Thumbnail */}
            {parsedContent.media[0].type === 'image' ? (
              <img
                src={parsedContent.media[0].url}
                alt="Capsule media"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <video
                src={parsedContent.media[0].url}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Dark Overlay on Hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-success/30 backdrop-blur-sm rounded-full p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            
            {/* Media Count Badge */}
            {parsedContent.media.length > 1 && (
              <div className="absolute top-3 right-3 bg-success/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 border border-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {parsedContent.media.length} items
              </div>
            )}
            
            {/* Media Type Indicator */}
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-medium border border-white/20">
              {parsedContent.media[0].type === 'image' ? '📷 Photo' : '🎥 Video'}
            </div>
          </div>
          
          {/* Click to view hint */}
          <p className="mt-2 text-xs text-success text-center font-medium">
            ✨ Click to view {parsedContent.media.length > 1 ? 'all media in full screen' : 'in full size'}
          </p>
        </div>
      )}

      {/* Media Carousel Modal */}
      <MediaCarousel
        media={parsedContent.media}
        isOpen={showCarousel}
        onClose={() => setShowCarousel(false)}
        initialIndex={carouselIndex}
      />
    </div>
  );
}
