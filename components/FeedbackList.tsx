'use client'

import { StoredFeedback } from '@/lib/types';

interface FeedbackListProps {
  feedback: StoredFeedback[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function FeedbackList({ feedback }: FeedbackListProps) {
  if (feedback.length === 0) return null;

  const avgRating = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-xl font-semibold">Reviews</h3>
        <span className="text-sm text-gray-500">
          ({feedback.length} review{feedback.length !== 1 ? 's' : ''} &middot; {avgRating.toFixed(1)} avg)
        </span>
      </div>
      <div className="space-y-4">
        {feedback.map(item => (
          <div key={item.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-dark">{item.name}</span>
                <StarRating rating={item.rating} />
              </div>
              <span className="text-xs text-gray-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{item.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
