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
  const [copied, setCopied] = useState(false);

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
   * Handles sharing capsule by copying public URL to clipboard
   */
  const handleShare = async () => {
    const url = `${window.location.origin}/capsule/${capsule.id}`;
    
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
        
        {/* Share and Delete Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="text-blue-400 hover:text-blue-300 transition-colors relative group"
            title="Share capsule"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
            {copied && (
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Link copied!
              </span>
            )}
          </button>
          
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
