import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const Stage3GeographyMapIndia = ({ selectedNode }) => {
    const containerRef = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        const loadMap = () => {
            if (
                !window.am5 ||
                !window.am5map ||
                !window.am5geodata_worldLow ||
                !window.am5geodata_indiaLow
            ) {
                setTimeout(loadMap, 100);
                return;
            }

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

            const worldSeries = chart.series.push(
                window.am5map.MapPolygonSeries.new(root, {
                    geoJSON: window.am5geodata_worldLow,
                    exclude: ["AQ"], // exclude Antarctica
                })
            );

            const indiaSeries = chart.series.push(
                window.am5map.MapPolygonSeries.new(root, {
                    geoJSON: window.am5geodata_indiaLow,
                })
            );

            [worldSeries, indiaSeries].forEach((series) => {
                series.mapPolygons.template.setAll({
                    fill: window.am5.color(0xd3d3d3),
                    stroke: window.am5.color(0xffffff),
                    strokeWidth: 0.8,
                    tooltipText: "{name}",
                });
            });

            chart.appear(1000, 100);
            instanceRef.current = { root, chart, indiaSeries, worldSeries };
        };

        loadMap();

        return () => {
            if (instanceRef.current?.root) {
                instanceRef.current.root.dispose();
                instanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!instanceRef.current || !selectedNode) return;

        const { indiaSeries, worldSeries, chart } = instanceRef.current;

        const name =
            typeof selectedNode === "string"
                ? selectedNode.toLowerCase().trim()
                : selectedNode.name?.toLowerCase().trim() || "";

        // -------------------- MAPPING --------------------
        const regions = {
            // Countries
            bangladesh: ["bangladesh"],
            germany: ["germany"],
            india: ["andhra pradesh", "tamil nadu", "karnataka", "kerala", "maharashtra", "gujarat", "rajasthan", "punjab", "uttar pradesh", "west bengal", "odisha"],
            "sri lanka": ["sri lanka"],

            // India regions
            east: ["odisha", "west bengal", "bihar", "jharkhand", "assam"],
            north: ["uttar pradesh", "punjab", "haryana", "delhi", "himachal pradesh"],
            south: ["telangana", "andhra pradesh", "tamil nadu", "karnataka", "kerala"],
            west: ["maharashtra", "gujarat", "rajasthan", "goa"],

            // Sub-regions
            "east-1": ["odisha"],
            "east-2": ["west bengal"],

            // East-1 details
            or: ["odisha"],
            bhubaneshwar: ["odisha"],

            // East-2 details
            wb: ["west bengal"],
            kolkatta: ["west bengal"],
            siliguri: ["west bengal"],

            // North
            "north-1": ["uttar pradesh"],
            "north-2": ["punjab", "haryana", "himachal pradesh"],

            // North-1 details
            up: ["uttar pradesh"],
            kanpur: ["uttar pradesh"],
            jhansi: ["uttar pradesh"],

            // South
            "south-1": ["telangana"],
            "south-2": ["andhra pradesh"],
            "south-3": ["tamil nadu"],

            // South-1 details
            tl: ["telangana"],
            hyderabad: ["telangana"],

            // South-3 details
            tn: ["tamil nadu"],
            madurai: ["tamil nadu"],

            // West
            "west-1": ["maharashtra"],
            mh: ["maharashtra"],
            mumbai: ["maharashtra"],
            "west-2": ["rajasthan"],
            rj: ["rajasthan"],
            jaipur: ["rajasthan"],
        };

        const zoomTargets = {
            // Countries
            india: { lat: 22, lon: 78, zoom: 4.5 },
            germany: { lat: 51, lon: 10, zoom: 5 },
            bangladesh: { lat: 23.7, lon: 90.3, zoom: 6 },
            "sri lanka": { lat: 7.9, lon: 80.8, zoom: 6.5 },

            // Indian regions (closer)
            east: { lat: 22, lon: 86, zoom: 6.5 },
            north: { lat: 28, lon: 77, zoom: 6.3 },
            south: { lat: 13, lon: 79, zoom: 6.3 },
            west: { lat: 20, lon: 74, zoom: 6.2 },

            // States
            odisha: { lat: 20.3, lon: 85.8, zoom: 7.5 },
            "west bengal": { lat: 23, lon: 87, zoom: 7.5 },
            telangana: { lat: 17.5, lon: 79.1, zoom: 7.5 },
            "andhra pradesh": { lat: 15, lon: 80, zoom: 7.5 },
            "tamil nadu": { lat: 11, lon: 78, zoom: 7.5 },
            maharashtra: { lat: 19.7, lon: 75.7, zoom: 7.5 },
            rajasthan: { lat: 27, lon: 74, zoom: 7.5 },

            // Cities (tight zoom)
            hyderabad: { lat: 17.4, lon: 78.5, zoom: 9 },
            kolkatta: { lat: 22.6, lon: 88.4, zoom: 9 },
            siliguri: { lat: 26.7, lon: 88.4, zoom: 9 },
            bhubaneshwar: { lat: 20.3, lon: 85.8, zoom: 9 },
            madurai: { lat: 9.9, lon: 78.1, zoom: 9 },
            mumbai: { lat: 19.07, lon: 72.87, zoom: 9 },
            jaipur: { lat: 26.9, lon: 75.8, zoom: 9 },
            kanpur: { lat: 26.4, lon: 80.3, zoom: 9 },
            jhansi: { lat: 25.4, lon: 78.6, zoom: 9 },
        };


        const highlightStates = regions[name] || [];

        // Reset all fills first
        indiaSeries.mapPolygons.each((p) =>
            p.set("fill", window.am5.color(0xd3d3d3))
        );
        worldSeries.mapPolygons.each((p) =>
            p.set("fill", window.am5.color(0xd3d3d3))
        );

        // Highlight states
        indiaSeries.mapPolygons.each((p) => {
            const stateName = (p.dataItem.dataContext.name || "").toLowerCase();
            if (highlightStates.includes(stateName)) {
                p.set("fill", window.am5.color(0xff5733));
            }
        });

        // Highlight entire India (special handling)
        if (name === "india") {
            indiaSeries.mapPolygons.each((p) => {
                p.set("fill", window.am5.color(0xff5733));
            });
        }

        // Highlight other countries (Bangladesh, Germany, etc.)
        worldSeries.mapPolygons.each((p) => {
            const polygonName = (p.dataItem.dataContext.name || "").toLowerCase();
            if (highlightStates.includes(polygonName) || polygonName === name) {
                p.set("fill", window.am5.color(0xff5733));
            }
        });

        // Zoom logic
        const target =
            zoomTargets[name] ||
            zoomTargets[highlightStates[0]] ||
            zoomTargets["india"];

        chart.zoomToGeoPoint(
            { latitude: target.lat, longitude: target.lon },
            target.zoom,
            true
        );
    }, [selectedNode]);

    return <MapWrapper ref={containerRef} />;
};

export default Stage3GeographyMapIndia;

const MapWrapper = styled.div`
  width: 100%;
  height: 140px; /* was 300px */
  border-radius: 8px;
  background: #f8fafc;
  overflow: hidden;
`;

