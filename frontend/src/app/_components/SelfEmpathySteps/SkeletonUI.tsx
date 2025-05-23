'use client';

import './SkeletonUI.css';

interface SkeletonUIProps {
  type?: 'question' | 'card' | 'loading';
}

export default function SkeletonUI({ type = 'question' }: SkeletonUIProps) {
  if (type === 'question') {
    return (
      <div className="skeleton-container">
        <div className="skeleton-question">
          <div className="skeleton-text-group">
            <div className="skeleton-small-text"></div>
            <div className="skeleton-large-text"></div>
          </div>
          <div className="skeleton-buttons">
            <div className="skeleton-yesno-btn"></div>
            <div className="skeleton-yesno-btn"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="skeleton-container">
        <div className="skeleton-question">
          <div className="skeleton-text-group">
            <div className="skeleton-small-text"></div>
            <div className="skeleton-large-text"></div>
          </div>
          <div className="skeleton-card">
            <div className="skeleton-card-content">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line"></div>
            </div>
          </div>
          <div className="skeleton-bottom-text">
            <div className="skeleton-line short"></div>
            <div className="skeleton-line"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'loading') {
    return (
      <div className="skeleton-loading">
        <div className="skeleton-loading-icon"></div>
        <div className="skeleton-loading-text"></div>
      </div>
    );
  }

  return null;
}
