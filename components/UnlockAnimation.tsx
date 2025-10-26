/**
 * UnlockAnimation Component
 * Wrapper animation for capsule cards - expanding glow effect on unlock
 */

'use client';

import { useEffect, useState } from 'react';

interface UnlockAnimationProps {
  children: React.ReactNode;
  isUnlocked?: boolean;
  show?: boolean;
  onComplete?: () => void;
}

export default function UnlockAnimation({ children, isUnlocked = true, show, onComplete }: UnlockAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // If show prop is provided, use it; otherwise use isUnlocked
    const shouldShow = show !== undefined ? show : isUnlocked;
    
    if (shouldShow) {
      // Start animation on mount
      setShowAnimation(true);
      
      // Hide animation after 2.5 seconds
      const timer = setTimeout(() => {
        setShowAnimation(false);
        if (onComplete) {
          onComplete();
        }
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isUnlocked, show, onComplete]);

  return (
    <div className="relative">
      {/* Animated capsule wrapper */}
      <div className={`relative transition-all duration-700 ${
        showAnimation ? 'scale-105' : 'scale-100'
      }`}>
        {/* Expanding glow rings */}
        {showAnimation && (
          <>
            {/* Outer glow ring */}
            <div className="absolute inset-0 -m-8 rounded-2xl bg-success/20 blur-2xl animate-expandFade"></div>
            
            {/* Middle glow ring */}
            <div className="absolute inset-0 -m-6 rounded-2xl bg-primary/30 blur-xl animate-expandFade" style={{ animationDelay: '0.2s' }}></div>
            
            {/* Inner glow ring */}
            <div className="absolute inset-0 -m-4 rounded-2xl bg-white/20 blur-lg animate-expandFade" style={{ animationDelay: '0.4s' }}></div>

            {/* Particle effects */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-success animate-particleBurst"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 30}deg) translateY(-50%)`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}

            {/* Unlock badge overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 animate-fadeInDown">
              <div className="bg-success/90 backdrop-blur-sm px-4 py-2 rounded-full border border-success">
                <p className="text-white text-sm font-semibold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                  </svg>
                  Unlocked
                </p>
              </div>
            </div>
          </>
        )}

        {/* Original card content */}
        <div className={`relative ${showAnimation ? 'animate-glowPulse' : ''}`}>
          {children}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes expandFade {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes particleBurst {
          0% {
            transform: rotate(var(--rotation)) translateY(0);
            opacity: 1;
          }
          100% {
            transform: rotate(var(--rotation)) translateY(-80px);
            opacity: 0;
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(86, 173, 1, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(86, 173, 1, 0.6);
          }
        }

        .animate-expandFade {
          animation: expandFade 2s ease-out forwards;
        }

        .animate-particleBurst {
          animation: particleBurst 1.5s ease-out forwards;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.5s ease-out forwards;
        }

        .animate-glowPulse {
          animation: glowPulse 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
