/**
 * CapsuleCard Component
 * Displays a time capsule preview with content
 */

'use client';

import { useState } from 'react';
import { Capsule } from '@/lib/db/schema';

interface CapsuleCardProps {
  capsule: Capsule;
  onDelete?: (id: string) => void;
}

export default function CapsuleCard({ capsule, onDelete }: CapsuleCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  // Parse content (it's stored as JSON with text and media)
  let parsedContent;
  try {
    parsedContent = JSON.parse(capsule.content);
  } catch {
    // Fallback if content is plain text
    parsedContent = { text: capsule.content, media: null, mediaType: null };
  }

  const { text, media, mediaType } = parsedContent;

  /**
   * Formats date to readable string
   */
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Handles capsule deletion
   */
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this capsule? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/capsules?id=${capsule.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete capsule');
      }

      if (onDelete) {
        onDelete(capsule.id);
      }
    } catch (error) {
      alert('Failed to delete capsule. Please try again.');
      setIsDeleting(false);
    }
  };

  /**
   * Calculates time since creation
   */
  const getTimeSinceCreation = () => {
    const created = new Date(capsule.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1 month ago';
    if (diffMonths < 12) return `${diffMonths} months ago`;
    
    const diffYears = Math.floor(diffMonths / 12);
    return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
  };

  return (
    <div className="glass rounded-xl p-6 shadow-xl animate-fadeIn hover:shadow-2xl transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📦</span>
            <h3 className="text-lg font-semibold">Time Capsule</h3>
          </div>
          <p className="text-sm text-gray-400">
            Created {getTimeSinceCreation()}
          </p>
        </div>
        
        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
          title="Delete capsule"
        >
          {isDeleting ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Unlock Date Badge */}
      <div className="mb-4 inline-block px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm">
        🔓 Unlocked: {formatDate(capsule.unlockDate)}
      </div>

      {/* Text Content */}
      {text && (
        <div className="mb-4">
          <p className={`text-gray-200 whitespace-pre-wrap ${!showFullContent && text.length > 200 ? 'line-clamp-3' : ''}`}>
            {text}
          </p>
          {text.length > 200 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="mt-2 text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              {showFullContent ? 'Show less' : 'Read more...'}
            </button>
          )}
        </div>
      )}

      {/* Media Content */}
      {media && mediaType === 'image' && (
        <div className="mt-4 rounded-lg overflow-hidden">
          <img
            src={media}
            alt="Capsule content"
            className="w-full h-auto max-h-96 object-cover"
          />
        </div>
      )}

      {media && mediaType === 'video' && (
        <div className="mt-4 rounded-lg overflow-hidden">
          <video
            src={media}
            controls
            className="w-full h-auto max-h-96"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm text-gray-400">
        <span>ID: {capsule.id.slice(0, 8)}...</span>
        <span>🔒 Encrypted</span>
      </div>
    </div>
  );
}
