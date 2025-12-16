import { Link } from 'react-router-dom';
import type { Gig } from '@/entities/gig';
import { Card } from '@/shared/ui';

interface GigCardProps {
  gig: Gig;
}

export function GigCard({ gig }: GigCardProps) {
  return (
    <Link to={`/gigs/${gig.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {gig.title}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {gig.description}
          </p>
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">by {gig.freelancer_name}</span>
              {gig.freelancer_rating && (
                <span className="text-xs text-yellow-600">
                  ⭐ {gig.freelancer_rating.toFixed(1)}
                </span>
              )}
            </div>
            
            <div className="text-right">
              <span className="text-lg font-bold text-green-600">
                ${gig.price}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
