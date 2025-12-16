import { useState } from 'react';
import type { GigFilters } from '@/entities/gig';
import { GigSearchBar, GigCard, useSearchGigs } from '@/features/gigs';
import { Loading, Alert } from '@/shared/ui';

export function BrowseGigsPage() {
  const [filters, setFilters] = useState<GigFilters>({});
  const { gigs, isLoading, error } = useSearchGigs(filters);

  const handleSearch = (newFilters: GigFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Gigs
          </h1>
          <p className="text-gray-600">
            Find freelance services for your projects
          </p>
        </div>

        <div className="mb-8">
          <GigSearchBar onSearch={handleSearch} />
        </div>

        {isLoading && <Loading />}
        
        {error && (
          <Alert variant="error">{error}</Alert>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.length > 0 ? (
              gigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No gigs found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
