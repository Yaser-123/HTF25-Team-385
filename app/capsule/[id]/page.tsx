import { db } from '@/lib/db';
import { capsules } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { decrypt } from '@/lib/encryption';
import { currentUser } from '@clerk/nextjs/server';

export default async function CapsulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const capsule = await db.query.capsules.findFirst({
    where: eq(capsules.id, id),
  });

  if (!capsule) {
    notFound();
  }

  const user = await currentUser();
  const now = new Date();
  const unlockDate = new Date(capsule.unlockDate);
  const isUnlocked = now >= unlockDate;
  const isOwner = user?.id === capsule.userId;

  // Calculate time remaining
  const timeRemaining = unlockDate.getTime() - now.getTime();
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  let parsedContent = { text: '', media: null, mediaType: null };
  if (isUnlocked) {
    try {
      const decryptedContent = decrypt(capsule.content);
      // Parse the JSON content
      try {
        parsedContent = JSON.parse(decryptedContent);
      } catch {
        // If not JSON, treat as plain text
        parsedContent = { text: decryptedContent, media: null, mediaType: null };
      }
    } catch (error) {
      console.error('Decryption error:', error);
      parsedContent = { text: 'Error decrypting content', media: null, mediaType: null };
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Time Capsule</h1>
            {isOwner && (
              <span className="px-4 py-2 bg-purple-500/30 backdrop-blur-sm rounded-full text-white text-sm">
                Your Capsule
              </span>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-300 text-sm mb-2">
              Created on {new Date(capsule.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="text-gray-300 text-sm">
              Unlocks on {unlockDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {!isUnlocked ? (
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
              <p className="text-gray-300 mb-6">
                This capsule will unlock in:
              </p>
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-white" id="days">{days}</div>
                  <div className="text-gray-300 text-sm">Days</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-white" id="hours">{hours}</div>
                  <div className="text-gray-300 text-sm">Hours</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-white" id="minutes">{minutes}</div>
                  <div className="text-gray-300 text-sm">Minutes</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-white" id="seconds">{seconds}</div>
                  <div className="text-gray-300 text-sm">Seconds</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
              <div className="flex items-center mb-4">
                <svg
                  className="w-8 h-8 text-green-400 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 15.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-green-400">🔓 Capsule Unlocked</h2>
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
                  <video
                    src={parsedContent.media}
                    controls
                    className="w-full h-auto max-h-96"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>

      {!isUnlocked && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function updateCountdown() {
                const unlockTime = new Date('${unlockDate.toISOString()}').getTime();
                const now = new Date().getTime();
                const distance = unlockTime - now;

                if (distance < 0) {
                  window.location.reload();
                  return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                document.getElementById('days').textContent = days;
                document.getElementById('hours').textContent = hours;
                document.getElementById('minutes').textContent = minutes;
                document.getElementById('seconds').textContent = seconds;
              }

              setInterval(updateCountdown, 1000);
            `,
          }}
        />
      )}
    </div>
  );
}
