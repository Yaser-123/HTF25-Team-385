'use client';

import { useState } from 'react';

interface CapsuleVerificationProps {
  capsuleId: string;
  question: string;
  onVerified: () => void;
}

export default function CapsuleVerification({ capsuleId, question, onVerified }: CapsuleVerificationProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      const response = await fetch(`/api/capsules/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          capsuleId,
          answer: userAnswer.toLowerCase().trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      if (data.verified) {
        onVerified();
      } else {
        setError('❌ Incorrect answer. Please try again.');
        setUserAnswer('');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/30">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-yellow-400 mb-2">Security Question</h2>
        <p className="text-gray-300">
          This capsule is protected. Please answer the security question to unlock.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Question:
          </label>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-white text-lg">{question}</p>
          </div>
        </div>

        <div>
          <label htmlFor="answer" className="block text-sm font-medium mb-2">
            Your Answer:
          </label>
          <input
            id="answer"
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer (case-insensitive)"
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
            autoFocus
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isVerifying || !userAnswer.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          ) : (
            '🔓 Unlock Capsule'
          )}
        </button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-4">
        💡 Answers are checked case-insensitively
      </p>
    </div>
  );
}
