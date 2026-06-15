// ...existing code...
import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from "react";
import { fetchMetrics as fetchMetricsAPI } from "../services/metricsService";

const MetricsContext = createContext();

export const MetricsProvider = ({ children }) => {
  // initialize from sessionStorage so we can show cached data immediately
  const [metrics, setMetrics] = useState(() => {
    const saved = sessionStorage.getItem("dashboardMetrics");
    return saved ? JSON.parse(saved) : null;
  });

  // loading = true only when there is no cached data (first full load)
  const [loading, setLoading] = useState(metrics ? false : true);
  // refreshing = true when background refresh is running (we still show cached data)
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const metricsRef = useRef(metrics);
  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  // fetchMetrics exposed to components; force=true shows loader even if cached
  const fetchMetrics = useCallback(
    async (force = false) => {
      // if we have cached metrics and not forcing, refresh in background
      if (!force && metricsRef.current) {
        setRefreshing(true);
        setError(null);
        try {
          const data = await fetchMetricsAPI();
          setMetrics(data);
          sessionStorage.setItem("dashboardMetrics", JSON.stringify(data));
        } catch (err) {
          setError(err);
        } finally {
          setRefreshing(false);
        }
        return;
      }

      // no cached data (first load) or forced fetch -> show main loader
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMetricsAPI();
        setMetrics(data);
        sessionStorage.setItem("dashboardMetrics", JSON.stringify(data));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // auto-load on mount if no cached data
  useEffect(() => {
    if (!metrics) fetchMetrics();
  }, [metrics, fetchMetrics]);

  return (
    <MetricsContext.Provider value={{ metrics, loading, refreshing, error, fetchMetrics }}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = () => {
  return useContext(MetricsContext);
};