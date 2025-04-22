interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold text-red-700 mb-2">Error</h3>
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="btn bg-red-600 text-white hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}