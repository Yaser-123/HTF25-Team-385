/**
 * CapsuleForm Component
 * Form to create a new time capsule with text, image/video, and unlock date
 */

'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface CapsuleFormProps {
  onCapsuleCreated?: () => void;
}

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

export default function CapsuleForm({ onCapsuleCreated }: CapsuleFormProps) {
  const [textContent, setTextContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);
  const [unlockDate, setUnlockDate] = useState('');
  const [unlockTime, setUnlockTime] = useState('');
  const [unlockPeriod, setUnlockPeriod] = useState<'AM' | 'PM'>('PM');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * Handles multiple file uploads and converts to base64
   */
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError('');
    const newMediaItems: MediaItem[] = [];

    // Check total number of files
    if (mediaFiles.length + files.length > 10) {
      setError('Maximum 10 media files allowed');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file size (max 5MB per file)
      if (file.size > 5 * 1024 * 1024) {
        setError(`File "${file.name}" is too large. Max 5MB per file.`);
        continue;
      }

      // Validate file type
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        setError(`File "${file.name}" is not a valid image or video.`);
        continue;
      }

      // Convert to base64
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          newMediaItems.push({
            url: base64String,
            type: isImage ? 'image' : 'video',
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    setMediaFiles([...mediaFiles, ...newMediaItems]);
  };

  /**
   * Remove a media item from the list
   */
  const removeMediaItem = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!textContent && mediaFiles.length === 0) {
      setError('Please add some content (text or media)');
      return;
    }

    if (!unlockDate || !unlockTime) {
      setError('Please select both unlock date and time');
      return;
    }

    // Validate question/answer pair
    if (question && !answer) {
      setError('Please provide an answer for the security question');
      return;
    }

    if (!question && answer) {
      setError('Please provide a question for the security answer');
      return;
    }

    // Parse the time with AM/PM
    const [hours, minutes] = unlockTime.split(':').map(Number);
    let hour24 = hours;
    
    if (unlockPeriod === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (unlockPeriod === 'AM' && hours === 12) {
      hour24 = 0;
    }

    // Combine date and time
    const selectedDate = new Date(unlockDate);
    selectedDate.setHours(hour24, minutes, 0, 0);

    // Validate unlock date is in the future (at least 1 minute from now)
    const now = new Date();
    const oneMinuteFromNow = new Date(now.getTime() + 60000); // 1 minute buffer
    
    if (selectedDate <= oneMinuteFromNow) {
      setError('Unlock time must be at least 1 minute in the future');
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine text and media array into JSON format
      const content = JSON.stringify({
        text: textContent,
        media: mediaFiles,
      });

      const response = await fetch('/api/capsules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          unlockDate: selectedDate.toISOString(),
          question: question || null,
          answer: answer ? answer.toLowerCase() : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create capsule');
      }

      // Success! Reset form
      setSuccess('🎉 Time capsule created successfully!');
      setTextContent('');
      setMediaFiles([]);
      setUnlockDate('');
      setUnlockTime('');
      setUnlockPeriod('PM');
      setQuestion('');
      setAnswer('');

      // Reset file input
      const fileInput = document.getElementById('media-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Callback to parent component
      if (onCapsuleCreated) {
        onCapsuleCreated();
      }

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Gets minimum date for date picker (today)
   */
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  /**
   * Gets current time in 12-hour format for default
   */
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const hour12 = hours % 12 || 12;
    return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Create a Time Capsule
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Content */}
        <div>
          <label htmlFor="text-content" className="block text-sm font-medium mb-2">
            Your Message
          </label>
          <textarea
            id="text-content"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Write a message to your future self..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={6}
          />
        </div>

        {/* Media Upload */}
        <div>
          <label htmlFor="media-upload" className="block text-sm font-medium mb-2">
            Add Photos or Videos (Optional, Max 10)
          </label>
          <input
            id="media-upload"
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-primary-hover file:cursor-pointer"
          />
          
          {/* Media Preview Grid */}
          {mediaFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {mediaFiles.map((media, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMediaItem(index)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {media.type === 'image' ? '📷' : '🎥'}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {mediaFiles.length > 0 && (
            <p className="mt-2 text-sm text-success">
              ✓ {mediaFiles.length} file{mediaFiles.length > 1 ? 's' : ''} uploaded
            </p>
          )}
        </div>

        {/* Unlock Date and Time */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            Unlock Date & Time *
          </label>
          
          {/* Date Picker */}
          <div>
            <label htmlFor="unlock-date" className="block text-xs text-gray-400 mb-1">
              Date
            </label>
            <input
              id="unlock-date"
              type="date"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              min={getMinDate()}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Time Picker with AM/PM */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="unlock-time" className="block text-xs text-gray-400 mb-1">
                Time
              </label>
              <input
                id="unlock-time"
                type="time"
                value={unlockTime}
                onChange={(e) => setUnlockTime(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="unlock-period" className="block text-xs text-gray-400 mb-1">
                Period
              </label>
              <select
                id="unlock-period"
                value={unlockPeriod}
                onChange={(e) => setUnlockPeriod(e.target.value as 'AM' | 'PM')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="AM" className="bg-gray-800">AM</option>
                <option value="PM" className="bg-gray-800">PM</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            ⏰ Your capsule will unlock at least 1 minute from now
          </p>
        </div>

        {/* Optional Security Question */}
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-sm font-semibold mb-4 text-gray-300">
            🔐 Optional Security Question
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Add an extra layer of security. Anyone accessing this capsule will need to answer correctly.
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="security-question" className="block text-sm font-medium mb-2">
                Security Question
              </label>
              <input
                id="security-question"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What was our first pet's name?"
                maxLength={200}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {question && (
              <div>
                <label htmlFor="security-answer" className="block text-sm font-medium mb-2">
                  Answer
                </label>
                <input
                  id="security-answer"
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter the answer (case-insensitive)"
                  maxLength={100}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-400 mt-1">
                  💡 Answer will be checked case-insensitively
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-gradient-to-r bg-primary hover:bg-primary-hover rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : (
            '🚀 Create Time Capsule'
          )}
        </button>
      </form>
    </div>
  );
}
