import { useParams, useNavigate } from 'react-router-dom';
import { useGigDetails } from '@/features/gigs/model/useGigDetails';
import { Loading, Alert, Button, Card } from '@/shared/ui';

export function GigDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const gigId = Number(id);
  
  const { gig, isLoading, error } = useGigDetails(gigId);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !gig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert type="error" message={error || 'Gig not found'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="secondary"
          onClick={() => navigate('/gigs')}
          className="mb-6"
        >
          ← Back to Gigs
        </Button>

        <Card className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {gig.title}
          </h1>

          <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Freelancer</p>
              <p className="font-semibold text-gray-900">{gig.freelancer_name}</p>
            </div>
            
            {gig.freelancer_rating && (
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-semibold text-yellow-600">
                  ⭐ {gig.freelancer_rating.toFixed(1)}
                </p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-600">Price</p>
              <p className="text-2xl font-bold text-green-600">
                ${gig.price}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: gig.description }}
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Delivery: {gig.delivery_days} {gig.delivery_days === 1 ? 'day' : 'days'}
            </div>
            
            <Button size="lg">
              Order Now - ${gig.price}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
