'use client';

import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'white' | 'gray';
}

export default function LoadingSpinner({ size = 'medium', color = 'primary' }: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner ${size} ${color}`}>
      <div className="spinner-circle"></div>
    </div>
  );
} 