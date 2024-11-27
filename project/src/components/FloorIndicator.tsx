import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { calculateFloorPrice } from '../utils/analytics';

interface FloorIndicatorProps {
  floor: number;
}

export function FloorIndicator({ floor }: FloorIndicatorProps) {
  const { analytics } = calculateFloorPrice(floor);
  
  // Calculate the average visitors across all floors
  const averageVisitors = 100000 * Math.pow(1.02, 50); // Median floor baseline
  
  // Determine if this floor has high traffic
  const trafficRatio = analytics.visitors / averageVisitors;
  
  // Traffic status
  const isHighTraffic = trafficRatio > 1.2;
  const isLowTraffic = trafficRatio < 0.8;
  
  if (!isHighTraffic && !isLowTraffic) return null;
  
  return (
    <div 
      className={`absolute right-full mr-2 flex items-center gap-1 ${
        isHighTraffic ? 'text-emerald-500' : 'text-red-500'
      }`}
    >
      {isHighTraffic ? (
        <TrendingUp className="w-4 h-4" />
      ) : (
        <TrendingDown className="w-4 h-4" />
      )}
      <span className="text-xs font-medium">
        {Math.round(Math.abs(trafficRatio - 1) * 100)}%
      </span>
    </div>
  );
}