import React, { useEffect, useState } from 'react';
import apiConfig from '../../config/apiConfig';
import { FaStar } from 'react-icons/fa';

interface MenuItemCardProps {
  Dish_name: string;
  type: string;
  id: string;
  mealType: string;
}

interface Review {
  id: string;
  rating: string;
  Menu_item_id: string;
  User_id: string;
}

const ReviewMenuCard: React.FC<MenuItemCardProps> = ({ Dish_name, type, id, mealType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [ratingAllowed, setRatingAllowed] = useState(false);
  const apireviewUrl = `${apiConfig.getResourceUrl('review')}?`;

  // Define when ratings open for each meal type (24-hour format)
  const ratingStartTimes = {
    Breakfast: 8,    // 8 AM
    Lunch: 12,       // 12 PM
    Snacks: 17,      // 5 PM
    Dinner: 20       // 8 PM
  };

  useEffect(() => {
    // Check if current time is after the rating start time
    const checkRatingAvailability = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const startHour = ratingStartTimes[mealType as keyof typeof ratingStartTimes] || 0;
      
      setRatingAllowed(currentHour >= startHour);
    };

    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        checkRatingAvailability();

        const params = new URLSearchParams();
        const ssid = sessionStorage.getItem('key') || '';
        params.append('queryId', 'GET_ALL');
        params.append('session_id', ssid);

        const response = await fetch(apireviewUrl + params.toString());

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const reviewData = await response.json();
        setReviews(reviewData.resource || []);
        
        // Check if current user has already reviewed this item
        const userId = "b9cee83b-f548-471e-a700-31bcdaa5a4b5-38";
        const userReviewed = reviewData.resource.some(
          (review: Review) => review.Menu_item_id === id && review.User_id === userId
        );
        setHasReviewed(userReviewed);
        
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [id, submitSuccess, mealType]);

  const handleStarClick = (ratingValue: number) => {
    if (ratingAllowed) {
      setNewRating(ratingValue.toString());
    }
  };

  const handleSubmitReview = async () => {
    if (!ratingAllowed) {
      const startHour = ratingStartTimes[mealType as keyof typeof ratingStartTimes] || 0;
      setError(`Ratings for ${mealType} will open at ${startHour}:00`);
      return;
    }

    if (!newRating) {
      return;
    }
  
    if (hasReviewed) {
      setError('You have already rated this item');
      return;
    }
  
    setIsSubmitting(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      const ssid = sessionStorage.getItem('key') || '';
      const userId = "b9cee83b-f548-471e-a700-31bcdaa5a4b5-38";
      
      const reviewData = {
        User_id: userId,
        Menu_item_id: id,
        Ratings: newRating,
      };
  
      const jsonString = JSON.stringify(reviewData);
      const base64Encoded = btoa(jsonString);
      params.append('resource', base64Encoded);
      params.append('session_id', ssid);
      
      const response = await fetch(apireviewUrl + params.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }
  
      setSubmitSuccess(true);
      setHasReviewed(true);
      setNewRating(null);
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="border p-4 rounded-lg shadow bg-white hover:shadow-md transition">
      <h3 className="text-lg font-semibold">{Dish_name}</h3>
      <p className="text-sm text-gray-600 mb-1">{type}</p>
      
      {!ratingAllowed && (
        <div className="text-yellow-600 mb-3">
          Ratings for {mealType} will open at {ratingStartTimes[mealType as keyof typeof ratingStartTimes] || 0}:00
        </div>
      )}
      
      {hasReviewed ? (
        <div className="text-green-600 mb-3">You have already rated this item</div>
      ) : (
        <>
          <div className="mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((ratingValue) => (
                <FaStar
                  key={ratingValue}
                  size={20}
                  color={
                    !ratingAllowed ? "#e4e5e9" : 
                    newRating && ratingValue <= parseInt(newRating) ? "#ffc107" : "#e4e5e9"
                  }
                  onClick={() => handleStarClick(ratingValue)}
                  className={ratingAllowed ? "cursor-pointer" : "cursor-not-allowed"}
                />
              ))}
            </div>
          </div>
          
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting || submitSuccess || hasReviewed || !ratingAllowed}
            className='btn btn-primary'
          >
            {submitSuccess ? 'Submitted!' : 
             hasReviewed ? 'Already Rated' : 
             !ratingAllowed ? 'Ratings Not Open Yet' : 
             'Submit Rating'}
          </button>
        </>
      )}
    </div>
  );
};

export default ReviewMenuCard;