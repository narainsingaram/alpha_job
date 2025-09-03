import React from 'react';
import { UilStar, UilCheckCircle, UilTimesCircle } from '@iconscout/react-unicons';

const JobMatchIndicator = ({ score }) => {
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  // Determine label based on score
  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  // Render stars based on score
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(score / 20);
    const halfStar = score % 20 >= 10;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<UilStar key={i} className="text-amber-400" size={16} />);
      } else if (i === fullStars && halfStar) {
        stars.push(<UilStar key={i} className="text-amber-400" size={16} />);
      } else {
        stars.push(<UilStar key={i} className="text-gray-300" size={16} />);
      }
    }
    
    return stars;
  };

  if (score === undefined || score === null) return null;

  return (
    <div className="flex items-center space-x-2">
      <div className="flex">{renderStars()}</div>
      <span className={`font-bold ${getScoreColor()}`}>
        {score}%
      </span>
      <span className="text-xs text-gray-500">
        {getScoreLabel()}
      </span>
    </div>
  );
};

export default JobMatchIndicator;