import { useStore } from '../store';

export interface FloorAnalytics {
  visitors: number;
  engagement: number;
  premium: boolean;
}

// Simulated analytics data (in a real app, this would come from an API)
const floorAnalytics = new Map<number, FloorAnalytics>();

// Initialize with sample data
for (let floor = 1; floor <= 100; floor++) {
  const baseVisitors = 100000; // Base 100k visitors
  const multiplier = Math.pow(1.02, floor); // Higher floors get more traffic
  const randomFactor = 0.8 + Math.random() * 0.4; // Random variation ±20%
  
  floorAnalytics.set(floor, {
    visitors: Math.round(baseVisitors * multiplier * randomFactor),
    engagement: 0.1 + (Math.random() * 0.4), // 10-50% engagement rate
    premium: floor >= 90,
  });
}

export function calculateFloorPrice(floor: number): {
  basePrice: number;
  finalPrice: number;
  analytics: FloorAnalytics;
} {
  const analytics = floorAnalytics.get(floor) || {
    visitors: 0,
    engagement: 0,
    premium: false,
  };

  // Base price calculation
  const basePrice = 1000 * Math.pow(1.02, floor);

  // Visitor multiplier
  const visitorMultiplier = Math.log10(analytics.visitors / 10000) || 1;
  
  // Engagement bonus
  const engagementBonus = analytics.engagement * 0.5;

  // Premium floor bonus
  const premiumBonus = analytics.premium ? 1.5 : 1;

  // Calculate final price
  const finalPrice = Math.round(
    basePrice * visitorMultiplier * (1 + engagementBonus) * premiumBonus
  );

  return {
    basePrice: Math.round(basePrice),
    finalPrice,
    analytics,
  };
}