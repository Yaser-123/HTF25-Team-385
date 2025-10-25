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
  const [countdown, setCountdown] = useState<string>('');

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
          
          if (data.nextUnlockTime) {
            const nextUnlock = new Date(data.nextUnlockTime);
            setNextUnlockTime(nextUnlock);
            
            // If unlock time has passed, refresh the capsule list
            const now = new Date();
            if (nextUnlock <= now) {
              fetchCapsules();
            }
          } else {
            setNextUnlockTime(null);
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

  return (
    <>
      {/* Signed Out View */}
      <SignedOut>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Section */}
            <div className="animate-fadeIn">
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
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
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-lg transition-all shadow-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/sign-in"
                  className="px-8 py-4 border border-purple-400 hover:bg-purple-400/10 rounded-lg font-semibold text-lg transition-all"
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
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Create</h3>
                  <p className="text-gray-400">
                    Write a message, add photos or videos
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Lock</h3>
                  <p className="text-gray-400">
                    Choose a future unlock date
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
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
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Time Capsules
              </h1>
              <p className="text-gray-400">
                Create new capsules and view your unlocked memories
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Create Form */}
              <div>
                <CapsuleForm onCapsuleCreated={fetchCapsules} />
              </div>

              {/* Right: Capsules List */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    Unlocked Capsules ({capsules.length})
                  </h2>
                  
                  {/* Countdown Timer */}
                  {countdown && (
                    <div className="glass px-4 py-2 rounded-lg border border-purple-500/50">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-purple-400">⏰</span>
                        <span className="text-gray-300">Next unlock in:</span>
                        <span className="font-mono font-bold text-purple-400">
                          {countdown}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {isLoading ? (
                  <div className="glass rounded-xl p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
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
                          Your next capsule unlocks in <span className="text-purple-400 font-semibold">{countdown}</span>
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
      </SignedIn>
    </>
  );
}
