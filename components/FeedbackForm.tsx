'use client'

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { submitFeedback } from '@/lib/api';
import { FeedbackForm as FeedbackFormType } from '@/lib/types';
import toast from 'react-hot-toast';

interface FeedbackFormProps {
  recipeId: string;
  onSuccess?: () => void;
}

export default function FeedbackForm({ recipeId, onSuccess }: FeedbackFormProps) {
  const [form, setForm] = useState<Omit<FeedbackFormType, 'recipeId'>>({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  });

  const mutation = useMutation({
    mutationFn: (data: FeedbackFormType) => submitFeedback(data),
    onSuccess: () => {
      toast.success('Thank you for your feedback!');
      setForm({ name: '', email: '', rating: 5, comment: '' });
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to submit feedback. Please try again.');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ ...form, recipeId });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mt-8">
      <h3 className="text-xl font-semibold mb-4">Leave Your Feedback</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="rating" className="block mb-1 text-sm font-medium">Rating</label>
          <select
            id="rating"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block mb-1 text-sm font-medium">Comment</label>
          <textarea
            id="comment"
            name="comment"
            value={form.comment}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="btn btn-primary w-full"
        >
          {mutation.isPending ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
