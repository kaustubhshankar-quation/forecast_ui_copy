import React from "react";
import { ResponsiveLine } from "@nivo/line";
import styled from "styled-components";

function GraphComponent({ data }) {
  if (!data) return null;

  const forecast = data?.["Forecast"]?.[0] || {};
  const qty = data?.["Quantity to be ordered (EOQ)"]?.[0] || {};

  const keys = Object.keys(forecast);

  const lineData = [
    {
      id: "Forecast",
      color: "#032B4E",
      data: keys.map((key) => ({
        x: key,
        y: Number(forecast[key] ?? 0),
      })),
    },
    {
      id: "Quantity to be ordered (EOQ)",
      color: "#b8842f",
      data: keys.map((key) => ({
        x: key,
        y: Number(qty[key] ?? 0),
      })),
    },
  ];

  return (
    <Wrapper>
      <Card>
        <h2 className="chart-title">Inventory Analysis</h2>

        <div className="chart-wrapper">
          <ResponsiveLine
            data={lineData}
            margin={{ top: 40, right: 40, bottom: 150, left: 90 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: 0,
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            curve="linear"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 6,
              tickPadding: 8,
              tickRotation: 0,
              legend: "Time Period",
              legendPosition: "middle",
              legendOffset: 50,
            }}
            axisLeft={{
              tickSize: 6,
              tickPadding: 2,
              tickRotation: 0,
              legend: "Quantity",
              legendPosition: "middle",
              legendOffset: -60,
            }}
            colors={{ datum: "color" }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={3}
            pointBorderColor={{ from: "serieColor" }}
            enableGridY={true}
            gridYValues={6}
            enableArea={false}
            useMesh={true}
            enableSlices="x"
            lineWidth={3}
            legends={[
              {
                anchor: "bottom",
                direction: "column",
                justify: false,
                translateX: 0,
                translateY: 120,
                itemsSpacing: 10,
                itemWidth: 320,
                itemHeight: 22,
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 16,
                symbolShape: "circle",
                itemTextColor: "#032B4E",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 0.8,
                      itemTextColor: "#b8842f",
                    },
                  },
                ],
              },
            ]}
            theme={{
              background: "#ffffff",
              textColor: "#0F1116",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
              axis: {
                domain: {
                  line: {
                    stroke: "#032B4E",
                    strokeWidth: 2,
                  },
                },
                legend: {
                  text: {
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: "Poppins, sans-serif",
                    fill: "#0F1116",
                  },
                },
                ticks: {
                  line: {
                    stroke: "#032B4E",
                    strokeWidth: 2,
                  },
                  text: {
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "Inter, sans-serif",
                    fill: "#374151",
                  },
                },
              },
              grid: {
                line: {
                  stroke: "#e2e8f0",
                  strokeWidth: 1,
                },
              },
              legends: {
                text: {
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                  fill: "#0F1116",
                },
              },
            }}
            animate={true}
            motionConfig="slow"
            role="application"
            ariaLabel="Inventory line chart"
          />
        </div>
      </Card>
    </Wrapper>
  );
}

export default GraphComponent;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 600px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 1250px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  padding: 40px 50px 60px;
  text-align: center;
  border: 2px solid #1f4280;
  position: relative;
  overflow: hidden;

  .chart-title {
    font-size: 28px;
    font-weight: 600;
    font-family: "Poppins", sans-serif;
    color: #0f1116;
    margin-bottom: 35px;
    text-align: center;
    letter-spacing: 0;
    position: relative;
    text-shadow: 0 2px 4px rgba(3, 43, 78, 0.1);

    &::after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 4px;
      background: linear-gradient(90deg, #032b4e, #b8842f);
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(3, 43, 78, 0.3);
    }
  }

  .chart-wrapper {
    height: 610px;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    padding: 25px;
    border: 2px solid #1f4280;
    position: relative;
    overflow: visible;
    min-width: 0;

    &::before {
      content: "";
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #032b4e15, #b8842f15);
      border-radius: 20px;
      z-index: -1;
    }
  }

  .chart-wrapper > div {
    height: 100% !important;
    min-width: 0;
  }
`;
