import { db } from '@/lib/db';
import { capsules } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { decrypt } from '@/lib/encryption';
import { currentUser } from '@clerk/nextjs/server';
import CapsuleContent from '@/components/CapsuleContent';
import CapsulePageWrapper from '@/components/CapsulePageWrapper';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

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

  let parsedContent: { text: string; media: MediaItem[] } = { text: '', media: [] };
  if (isUnlocked) {
    try {
      const decryptedContent = decrypt(capsule.content);
      // Parse the JSON content
      try {
        const parsed = JSON.parse(decryptedContent);
        // Handle old format (single media) and new format (media array)
        if (parsed.media && !Array.isArray(parsed.media)) {
          // Old format conversion
          parsedContent = {
            text: parsed.text || '',
            media: parsed.media ? [{ url: parsed.media, type: parsed.mediaType || 'image' }] : []
          };
        } else {
          parsedContent = {
            text: parsed.text || '',
            media: parsed.media || []
          };
        }
      } catch {
        // If not JSON, treat as plain text
        parsedContent = { text: decryptedContent, media: [] };
      }
    } catch (error) {
      console.error('Decryption error:', error);
      parsedContent = { text: 'Error decrypting content', media: [] };
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-900 to-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <CapsulePageWrapper isUnlocked={isUnlocked} unlockDate={unlockDate} capsuleId={id}>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-white">Time Capsule</h1>
              {isOwner && (
                <span className="px-4 py-2 bg-primary/30 backdrop-blur-sm rounded-full text-white text-sm">
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

            <CapsuleContent
              capsuleId={capsule.id}
              isUnlocked={isUnlocked}
              hasQuestion={!!capsule.question}
              question={capsule.question}
              parsedContent={parsedContent}
              unlockDate={unlockDate}
              isOwner={isOwner}
            />

            <div className="mt-8 text-center">
              <a
                href="/"
                className="inline-block px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </CapsulePageWrapper>
      </div>
    </div>
  );
}
