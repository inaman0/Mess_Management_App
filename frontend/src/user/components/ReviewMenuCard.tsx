// ReviewMenuCard.tsx
import React, { useEffect, useState } from 'react';
import apiConfig from '../../config/apiConfig';
import { FaStar } from 'react-icons/fa';
import './ReviewCardStyles.css';

interface MenuItemCardProps {
  Dish_name: string;
  type: string;
  id: string;
  mealType: string;
  isFeast: boolean;
}

interface Review {
  id: string;
  rating: string;
  Menu_item_id: string;
  User_id: string;
}

const ReviewMenuCard: React.FC<MenuItemCardProps> = ({ Dish_name, type, id, mealType, isFeast }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [ratingAllowed, setRatingAllowed] = useState(false);
  const apireviewUrl = `${apiConfig.getResourceUrl('review')}?`;

  const ratingStartTimes = {
    Breakfast: 8,
    Lunch: 12,
    Snacks: 17,
    Dinner: 20
  };

  const HARDCODED_USER_ID = "ee9f67bb-bbe1-4b28-9be5-7d36be9d9f16-20";

  useEffect(() => {
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
        
        const userReviewed = reviewData.resource.some(
          (review: Review) => review.Menu_item_id === id && review.User_id === HARDCODED_USER_ID
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
      
      const reviewData = {
        User_id: HARDCODED_USER_ID,
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

  if (isLoading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div 
      className={`review-card ${isFeast ? 'feast' : ''}`}
      data-meal-type={mealType}
    >
      <div className="dish-info-container">
        <h3 className="dish-name">{Dish_name}</h3>
        <p className={`dish-type ${type === 'VEG' ? 'dish-type-veg' : 'dish-type-nonveg'}`}>
          {type}
        </p>
      </div>
      
      {!ratingAllowed && (
        <div className="rating-notice">
          Ratings for {mealType} will open at {ratingStartTimes[mealType as keyof typeof ratingStartTimes] || 0}:00
        </div>
      )}
      
      {hasReviewed ? (
        <div className="already-rated">You have already rated this item</div>
      ) : (
        <>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((ratingValue) => (
              <FaStar
                key={ratingValue}
                className={`star ${ratingAllowed ? '' : 'disabled'} ${
                  newRating && ratingValue <= parseInt(newRating) ? 'active' : ''
                }`}
                onClick={() => handleStarClick(ratingValue)}
              />
            ))}
          </div>
          
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting || submitSuccess || hasReviewed || !ratingAllowed}
            className={`submit-button ${
              submitSuccess ? 'submit-success' : ''
            }`}
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