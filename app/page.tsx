/**
 * Home Page
 * Displays all unlocked capsules for the logged-in user
 */

'use client';

import { useEffect, useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import CapsuleForm from '@/components/CapsuleForm';
import CapsuleCard from '@/components/CapsuleCard';
import { Capsule } from '@/lib/db/schema';
import Link from 'next/link';

export default function Home() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextUnlockTime, setNextUnlockTime] = useState<Date | null>(null);
  const [nextCapsuleId, setNextCapsuleId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string>('');
  const [copied, setCopied] = useState(false);

  /**
   * Fetches capsules from the API
   */
  const fetchCapsules = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/capsules');
      
      if (!response.ok) {
        throw new Error('Failed to fetch capsules');
      }

      const data = await response.json();
      setCapsules(data.capsules || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles capsule deletion
   */
  const handleCapsuleDeleted = (id: string) => {
    setCapsules(capsules.filter(capsule => capsule.id !== id));
  };

  /**
   * Fetch capsules on component mount and set up auto-refresh
   */
  useEffect(() => {
    fetchCapsules();
  }, []);

  /**
   * Auto-refresh when unlock time is reached
   * Checks every 10 seconds if any capsules should be unlocked
   */
  useEffect(() => {
    const checkForUnlocks = async () => {
      // Fetch all capsules including locked ones to check unlock times
      try {
        const response = await fetch('/api/capsules/upcoming');
        if (response.ok) {
          const data = await response.json();
          
          if (data.nextUnlockTime && data.nextCapsule) {
            const nextUnlock = new Date(data.nextUnlockTime);
            setNextUnlockTime(nextUnlock);
            setNextCapsuleId(data.nextCapsule.id);
            
            // If unlock time has passed, refresh the capsule list
            const now = new Date();
            if (nextUnlock <= now) {
              fetchCapsules();
            }
          } else {
            setNextUnlockTime(null);
            setNextCapsuleId(null);
          }
        }
      } catch (err) {
        // Silently fail for background checks
        console.error('Error checking for unlocks:', err);
      }
    };

    // Check immediately
    checkForUnlocks();

    // Set up interval to check every 10 seconds
    const interval = setInterval(checkForUnlocks, 10000);

    return () => clearInterval(interval);
  }, [capsules]);

  /**
   * Update countdown display every second
   */
  useEffect(() => {
    if (!nextUnlockTime) {
      setCountdown('');
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = nextUnlockTime.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown('Unlocking now...');
        fetchCapsules(); // Refresh immediately when time is reached
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setCountdown(`${minutes}m ${seconds}s`);
      } else {
        setCountdown(`${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextUnlockTime]);

  /**
   * Handle sharing upcoming capsule URL
   */
  const handleShareUpcoming = async () => {
    if (!nextCapsuleId) return;
    
    const url = `${window.location.origin}/capsule/${nextCapsuleId}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert('Failed to copy URL. Please copy manually: ' + url);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <>
      {/* Signed Out View */}
      <SignedOut>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Section */}
            <div className="animate-fadeIn">
              <h1 className="text-6xl font-bold mb-6 text-white">
                Welcome to Celestia
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Preserve your precious memories and unlock them in the future 🌌
              </p>
              
              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 my-12">
                <div className="glass p-6 rounded-xl">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="text-xl font-semibold mb-2">Secure & Encrypted</h3>
                  <p className="text-gray-400">
                    Your memories are protected with AES-256 encryption
                  </p>
                </div>
                
                <div className="glass p-6 rounded-xl">
                  <div className="text-4xl mb-4">⏰</div>
                  <h3 className="text-xl font-semibold mb-2">Time-Locked</h3>
                  <p className="text-gray-400">
                    Set a future date to unlock your time capsules
                  </p>
                </div>
                
                <div className="glass p-6 rounded-xl">
                  <div className="text-4xl mb-4">📸</div>
                  <h3 className="text-xl font-semibold mb-2">Rich Media</h3>
                  <p className="text-gray-400">
                    Store text, images, and videos in your capsules
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 justify-center">
                <Link
                  href="/sign-up"
                  className="px-8 py-4 bg-gradient-to-r bg-primary hover:bg-primary-hover rounded-lg font-semibold text-lg transition-all shadow-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/sign-in"
                  className="px-8 py-4 border border-primary hover:bg-primary/10 rounded-lg font-semibold text-lg transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* How It Works */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold mb-8">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Create</h3>
                  <p className="text-gray-400">
                    Write a message, add photos or videos
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Lock</h3>
                  <p className="text-gray-400">
                    Choose a future unlock date
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Unlock</h3>
                  <p className="text-gray-400">
                    Relive your memories when the time comes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>

      {/* Signed In View */}
      <SignedIn>
        <div className="h-screen flex flex-col overflow-hidden">
          {/* Fixed Header */}
          <div className="flex-shrink-0 container mx-auto px-4 py-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-4">
                <h1 className="text-4xl font-bold mb-2 text-white">
                  Your Time Capsules
                </h1>
                <p className="text-gray-400">
                  Create new capsules and view your unlocked memories
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-hidden container mx-auto px-4 pb-6">
            <div className="max-w-6xl mx-auto h-full">
              <div className="grid lg:grid-cols-2 gap-8 h-full">
                {/* Left: Create Form - Independently Scrollable */}
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="flex-1 overflow-y-auto pr-2 pb-4">
                    <CapsuleForm onCapsuleCreated={fetchCapsules} />
                  </div>
                </div>

                {/* Right: Capsules List - Independently Scrollable */}
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Fixed Section Header */}
                  <div className="flex-shrink-0 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold">
                        Unlocked Capsules ({capsules.length})
                      </h2>
                    </div>
                    
                    {/* Countdown Timer with Share Button */}
                    {countdown && nextCapsuleId && (
                      <div className="glass px-4 py-3 rounded-lg border border-border-color/30">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-primary text-lg">⏰</span>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                              <span className="text-gray-300 text-xs sm:text-sm">Next unlock in:</span>
                              <span className="font-mono font-bold text-primary text-base sm:text-sm">
                                {countdown}
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={handleShareUpcoming}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary-hover rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
                            title="Share countdown link"
                          >
                            {copied ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="hidden sm:inline">Copied!</span>
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                <span className="hidden sm:inline">Share</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scrollable Capsules Content */}
                  <div className="flex-1 overflow-y-auto pr-2 pb-4">
                    {isLoading ? (
                      <div className="glass rounded-xl p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="mt-4 text-gray-400">Loading your capsules...</p>
                      </div>
                    ) : error ? (
                      <div className="glass rounded-xl p-6 border border-red-500/50 bg-red-500/10">
                        <p className="text-red-200">Error: {error}</p>
                      </div>
                    ) : capsules.length === 0 ? (
                      <div className="glass rounded-xl p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-semibold mb-2">No Unlocked Capsules Yet</h3>
                        <p className="text-gray-400">
                          {countdown ? (
                            <>
                              Your next capsule unlocks in <span className="text-primary font-semibold">{countdown}</span>
                            </>
                          ) : (
                            'Create your first time capsule and wait for it to unlock!'
                          )}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {capsules.map((capsule) => (
                          <CapsuleCard
                            key={capsule.id}
                            capsule={capsule}
                            onDelete={handleCapsuleDeleted}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
