import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-6xl font-bold text-primary mb-4">404</h2>
      <h3 className="text-2xl font-semibold text-dark mb-2">Recipe Not Found</h3>
      <p className="text-gray-600 mb-8 max-w-md">
        The recipe you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <Link href="/" className="btn btn-primary">
        Browse All Recipes
      </Link>
    </div>
  );
}
