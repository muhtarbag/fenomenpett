import { useCallback } from "react";

export const usePerformanceMetrics = () => {
  return useCallback(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const pageLoadTime = (navigation.loadEventEnd - navigation.startTime).toFixed(2);
    const interactions = performance.getEntriesByType("event").length;
    const interactionRate = interactions > 0 ? ((interactions / performance.now()) * 100).toFixed(1) : "0";
    const sessionDuration = (performance.now() / 1000).toFixed(0);

    return {
      pageLoadTime,
      interactions,
      interactionRate,
      sessionDuration
    };
  }, []);
};