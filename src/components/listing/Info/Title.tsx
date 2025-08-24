import React from 'react';

interface TitleProps {
  title: string;
  location?: string;
}

export const Title: React.FC<TitleProps> = React.memo(({ title, location }) => {
  return (
    <div className="detail-title-section">
      <h1 className="detail-title">{title}</h1>
      {location && (
        <div className="detail-location">
          📍 {location}
        </div>
      )}
    </div>
  );
}); 