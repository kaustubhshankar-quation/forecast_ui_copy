import React, { useState, useEffect, useRef } from "react";
import { ResponsiveLine } from "@nivo/line";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { zeroIfNegative } from "../../../Utils/helper";

export default function SkuGraphPanel({
  skuItem,
  onClose,
  Product,
  Location,
  bestActPredData,
  multipleActPredData,
  selectedModel,
}) {
  const [plotData, setPlotData] = useState([]);
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const [skuData, setSkuData] = useState(null);
  const [graphTab, setGraphTab] = useState("actual");
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const pdfRef = useRef(null);

  const skuName = skuItem?.sku_name || skuItem?.name || Product;

  useEffect(() => {
    const isBestModelMode = selectedModel === "bestModel";
    console.log("cities from best model response", bestActPredData);
    const dataSource = isBestModelMode ? bestActPredData : multipleActPredData;

    if (dataSource?.status !== "success") return;

    try {
      let cities = [];

      if (dataSource?.data?.data?.cities) {
        cities = dataSource.data.data.cities; // best model response
      } else if (dataSource?.data?.cities) {
        cities = dataSource.data.cities; // multiple model response
      }

      const targetCity = Location || cities?.[0]?.city;
      const cityData = cities?.find((city) => city.city === targetCity) || cities?.[0];
      if (!cityData) return;

      const found =
        cityData?.data?.find(
          (sku) => (sku?.sku || "").trim().toLowerCase() === (skuName || "").trim().toLowerCase()
        ) || null;

      if (!found) return;

      setSkuData(found);

      let modelIndexToUse = 0;

      if (!isBestModelMode && selectedModel && found.multiple_model_data?.length) {
        const modelIndex = found.multiple_model_data.findIndex(
          (model) => model.model_name === selectedModel
        );
        if (modelIndex >= 0) {
          modelIndexToUse = modelIndex;
          setActiveModelIndex(modelIndex);
        }
      } else {
        setActiveModelIndex(0);
      }

      drawChart(found, modelIndexToUse, isBestModelMode);
    } catch (err) {
      console.error("Error processing graph data:", err);
    }
  }, [multipleActPredData, bestActPredData, Location, skuName, selectedModel]);
  useEffect(() => {
    if (skuData) {
      const isBestModelMode = selectedModel === "bestModel";
      drawChart(skuData, activeModelIndex, isBestModelMode);
    }
  }, [activeModelIndex, skuData, selectedModel]);

  function drawChart(data, modelIdx, isBestModelMode = false) {
    let modelData = [];

    if (isBestModelMode) {
      modelData = data?.data || [];
    } else {
      modelData = data?.multiple_model_data?.[modelIdx]?.data || [];
    }

    if (!modelData.length) {
      setPlotData([]);
      return;
    }

    // 🔥 Apply zeroIfNegative to ALL y values before chart rendering
    const actualSeries = {
      id: "Actual",
      color: "#0f1654",
      data: modelData.map((item) => ({
        x: item.frequency_year,
        y: item.actual,
      })),
    };

    const predictedData = modelData.map((item) => ({
      x: item.frequency_year,
      y: zeroIfNegative(item.predicted),
    }));

    // 🔥 FIXED: Show all historical data as "Predicted" (green) and all future as "Forecast" (orange)
    // Find the cutoff where forecast starts (typically where actual data ends)
    const actualEndIndex = actualSeries.data.findLastIndex(point => point.y > 0);
    const forecastStartIndex = Math.max(actualEndIndex + 1, predictedData.length - 6); // Last 6 periods as forecast

    const predictedNormal = {
      id: "Predicted",
      color: "#2EB8AA",
      data: predictedData.slice(0, forecastStartIndex),
    };

    const predictedHighlighted = {
      id: "Forecast",
      color: "#F2994A",
      data: predictedData.slice(forecastStartIndex - 1), // Overlap 1 point for smooth transition
    };

    console.log("actualSeries", actualSeries);
    console.log("predictedNormal", predictedNormal);
    console.log("predictedHighlighted", predictedHighlighted);

    setPlotData([actualSeries, predictedNormal, predictedHighlighted]);
  }

  const modelName =
    selectedModel === "bestModel"
      ? skuData?.top_model_name || "Best Model"
      : skuData?.multiple_model_data?.[activeModelIndex]?.model_name || "Model";

  const downloadPdf = async () => {
    if (!pdfRef.current) return;
    setPdfDownloading(true);
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${skuName || "SKU"}_${modelName || "Model"}_Report.pdf`);
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setPdfDownloading(false);
    }
  };

  return (
    <div ref={pdfRef} style={{ display: "flex", flexDirection: "column", height: "130%", background: "#f8fafc" }}>
      {/* Chart Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          padding: "0 8px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1F4280",
              lineHeight: 1.2,
            }}
          >
            {skuName}
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#475569",
              marginTop: 4,
            }}
          >
            Model: {modelName}
          </div>
        </div>
      </div>

     <div
  className="rounded-lg p-4"
  style={{
    border: "2px solid #1F4280",
    height: "1000px",
    width: "95%",
    backgroundColor: "#f8fdf9",
    margin: "24px",
    borderRadius: 20,
    overflow: "visible", // Change this from "hidden" to "visible"
  }}
>
        {plotData.length > 0 ? (
          <ResponsiveLine
            data={plotData}
            margin={{ top: 50, right: 40, bottom: 100, left: 70 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
            colors={{ datum: "color" }}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
            }}
            useMesh={true}
            pointSize={8}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                translateY: 85,
                itemWidth: 160,
                itemHeight: 30,
                itemsSpacing: 60,
                symbolSize: 18,
                symbolShape: "circle",
                itemTextColor: "#222",
                itemDirection: "left-to-right",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#1d2b7a",
                      itemBackground: "rgba(0,0,0,0.05)",
                    },
                  },
                ],
              },
            ]}
            theme={{
              legends: {
                text: {
                  fontSize: 19,
                  fontWeight: 700,
                  fill: "#222",
                },
              },
            }}
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              fontSize: 16,
            }}
          >
            No chart data available for this SKU
          </div>
        )}
      </div>
    </div>
  );
}