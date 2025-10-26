/**
 * CapsuleCard Component
 * Displays a time capsule preview with content
 */

'use client';

import { useState } from 'react';
import { Capsule } from '@/lib/db/schema';
import MediaCarousel from './MediaCarousel';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

interface CapsuleCardProps {
  capsule: Capsule;
  onDelete?: (id: string) => void;
}

export default function CapsuleCard({ capsule, onDelete }: CapsuleCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Parse content (it's stored as JSON with text and media array)
  let parsedContent: { text: string; media: MediaItem[] };
  try {
    const parsed = JSON.parse(capsule.content);
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
    // Fallback if content is plain text
    parsedContent = { text: capsule.content, media: [] };
  }

  const { text, media } = parsedContent;

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
      <div className="mb-4 inline-block px-3 py-1 bg-success/20 border border-success/50 rounded-full text-sm">
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
              className="mt-2 text-primary hover:text-primary-hover text-sm transition-colors"
            >
              {showFullContent ? 'Show less' : 'Read more...'}
            </button>
          )}
        </div>
      )}

      {/* Media Content - Single Thumbnail with Badge */}
      {media && media.length > 0 && (
        <div className="mt-4">
          <div
            className="relative w-full aspect-video rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => {
              setCarouselIndex(0);
              setShowCarousel(true);
            }}
          >
            {/* First Media Thumbnail */}
            {media[0].type === 'image' ? (
              <img
                src={media[0].url}
                alt="Capsule media"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <video
                src={media[0].url}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Dark Overlay on Hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            
            {/* Media Count Badge */}
            {media.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 border border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {media.length} items
              </div>
            )}
            
            {/* Media Type Indicator */}
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-medium border border-white/20">
              {media[0].type === 'image' ? '📷 Photo' : '🎥 Video'}
            </div>
          </div>
          
          {/* Click to view hint */}
          <p className="mt-2 text-xs text-gray-400 text-center">
            Click to view {media.length > 1 ? 'all media' : 'full size'}
          </p>
        </div>
      )}

      {/* Media Carousel Modal */}
      <MediaCarousel
        media={media}
        isOpen={showCarousel}
        onClose={() => setShowCarousel(false)}
        initialIndex={carouselIndex}
      />

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm text-gray-400">
        <span>ID: {capsule.id.slice(0, 8)}...</span>
        <span>🔒 Encrypted</span>
      </div>
    </div>
  );
}
