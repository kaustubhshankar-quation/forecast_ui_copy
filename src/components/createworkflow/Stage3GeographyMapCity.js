import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const Stage3GeographyMapCity = ({ selectedCity }) => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      // Wait for amCharts scripts
      if (
        !window.am5 ||
        !window.am5map ||
        !window.am5geodata_indiaLow ||
        !window.am5themes_Animated
      ) {
        setTimeout(initMap, 200);
        return;
      }

      // Prevent multiple roots
      if (instanceRef.current) return;

      const root = window.am5.Root.new(containerRef.current);
      root.setThemes([window.am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        window.am5map.MapChart.new(root, {
          panX: "translateX",
          panY: "translateY",
          projection: window.am5map.geoMercator(),
        })
      );

      const indiaSeries = chart.series.push(
        window.am5map.MapPolygonSeries.new(root, {
          geoJSON: window.am5geodata_indiaLow,
        })
      );

      indiaSeries.mapPolygons.template.setAll({
        fill: window.am5.color(0xd3d3d3),
        stroke: window.am5.color(0xffffff),
        strokeWidth: 0.8,
        tooltipText: "{name}",
      });

      // Create point (marker) series
      const pointSeries = chart.series.push(
        window.am5map.MapPointSeries.new(root, {})
      );

      pointSeries.bullets.push(() => {
        return window.am5.Bullet.new(root, {
          sprite: window.am5.Circle.new(root, {
            radius: 4,
            fill: window.am5.color(0xff0000),
            stroke: window.am5.color(0xffffff),
            strokeWidth: 1.5,
          }),
        });
      });

      chart.appear(1000, 100);

      instanceRef.current = { root, chart, indiaSeries, pointSeries };
    };

    initMap();

    return () => {
      if (instanceRef.current?.root) {
        instanceRef.current.root.dispose();
        instanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!instanceRef.current || !selectedCity) return;

    const { indiaSeries, chart, pointSeries } = instanceRef.current;
    const cityName = selectedCity.toLowerCase().trim();

    const cityToState = {
  hyderabad: { state: "telangana", lat: 17.4, lon: 78.5, zoom: 2.5 },
  bhubaneshwar: { state: "odisha", lat: 20.3, lon: 85.8, zoom: 2.5 },
  kolkatta: { state: "west bengal", lat: 22.6, lon: 88.4, zoom: 2.5 },
  madurai: { state: "tamil nadu", lat: 9.9, lon: 78.1, zoom: 2.5 },
  mumbai: { state: "maharashtra", lat: 19.07, lon: 72.87, zoom: 2.5 },
  jaipur: { state: "rajasthan", lat: 26.9, lon: 75.8, zoom: 2.5 },
  kanpur: { state: "uttar pradesh", lat: 26.4, lon: 80.3, zoom: 2.5 },
  jhansi: { state: "uttar pradesh", lat: 25.4, lon: 78.6, zoom: 2.5 },
  siliguri: { state: "west bengal", lat: 26.7, lon: 88.4, zoom: 2.5 },
};


    const city = cityToState[cityName];
    if (!city) return;

    // Reset all fills
    indiaSeries.mapPolygons.each((p) =>
      p.set("fill", window.am5.color(0xd3d3d3))
    );

    // Highlight selected state
    indiaSeries.mapPolygons.each((p) => {
      const stateName = (p.dataItem.dataContext.name || "").toLowerCase();
      if (stateName === city.state) {
        p.set("fill", window.am5.color(0xff5733));
      }
    });

    // Add marker point
    pointSeries.data.setAll([
      {
        geometry: {
          type: "Point",
          coordinates: [city.lon, city.lat],
        },
      },
    ]);

    // Zoom with smoother focus
    chart.zoomToGeoPoint(
      { latitude: city.lat, longitude: city.lon },
      city.zoom,
      true
    );
  }, [selectedCity]);

  return <MapWrapper ref={containerRef} />;
};

export default Stage3GeographyMapCity;

const MapWrapper = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 8px;
  background: #f8fafc;
  overflow: hidden;
`;
