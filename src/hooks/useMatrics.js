import { useContext } from "react";
import { MetricsContext } from "../contexts/MetricsContext";

const useMetrics = () => {
  const context = useContext(MetricsContext);

  if (!context) {
    throw new Error("useMetrics must be used within a MetricsProvider");
  }

  return context;
};

export default useMetrics;