import React, { useState, useEffect, useContext, useMemo } from "react";
import Slider from "react-slick";
import { MenuTab, MenuTabs } from "./MenuTabs";
import MenuContext from "./MenuContext";
import Report1 from "./Report1";
import Report2 from "./Report2";
import Report3 from "./Report3";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const styles = {
  wrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    background:
      "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
    padding: "60px 0",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  cardContainer: {
    width: "95%",
    maxWidth: "1500px",
    margin: "0 auto",
    background: "#fbfcf7ff",
    padding: "40px 40px 60px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    border: "1px solid #475C7E",
  },
  kpiCard: {
    background:
      "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
    borderRadius: "24px",
    padding: "40px 44px",
    color: "#fff",
    boxShadow:
      "0 12px 32px rgba(40, 20, 87, 0.2), 0 6px 18px rgba(29,43,122,0.3)",
    transition: "all 0.35s ease",
    height: "280px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  tagBase: {
    padding: "8px 18px",
    borderRadius: "14px",
    fontSize: "0.9rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100px",
    textAlign: "center",
    letterSpacing: "0.3px",
    boxShadow:
      "inset 0 0 6px rgba(255,255,255,0.3), 0 3px 6px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
  },
  label: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#A9D6E5",
    marginTop: "10px",
  },
  value: {
    fontSize: "20px",
    fontWeight: 800,
    marginTop: "8px",
  },
};

export default function WorkflowReportMenu({
  Product,
  Location,
  Workflow,
  topThreeData,
  children,
}) {
  const { activeTab, setActiveTab } = useContext(MenuContext);

  const [hovered, setHovered] = useState(null);
  const [hoverTag, setHoverTag] = useState(null);
  const [cardData, setCardData] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);

  useEffect(() => {
    setActiveTab("Report1");
  }, [Product, Location, setActiveTab]);

  // Build cards from latest topThreeData
  useEffect(() => {
    if (!topThreeData) {
      setCardData([]);
      setLoadingCards(true);
      return;
    }

    const rawCities = topThreeData.cities || [];
    const finalCards = [];

    rawCities.forEach((cityObj) => {
      const city = cityObj.city;
      const skuBlocks = cityObj.data || [];

      skuBlocks.forEach((skuBlock) => {
        const sku = skuBlock.sku;
        const modelList = skuBlock.data || [];

        const top3 = modelList.slice(0, 3);

        top3.forEach((m) => {
          finalCards.push({
            title: `${city} - ${sku}`,
            model_name: m.model,
            train_mape: m.train_mape,
            test_mape: m.test_mape,
          });
        });
      });
    });

    setCardData(finalCards);
    setLoadingCards(false);
  }, [topThreeData]);

  const changeMenu = (menu) => setActiveTab(menu);

  const sliderSettings = useMemo(() => {
    const visibleCount = loadingCards ? 3 : cardData.length;
    const canSlide = visibleCount > 3; // you can also just use visibleCount > 1

    return {
      dots: canSlide,
      infinite: canSlide,          // keep loop on
      speed: 400,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: canSlide,
      autoplay: true,          // always autoplay
      autoplaySpeed: 3000,
      cssEase: "linear",
      pauseOnHover: true,
      pauseOnFocus: false,
    };
  }, [cardData.length, loadingCards]);


  // Skeleton card using same footprint as real card
  const SkeletonCard = () => (
    <div className="mx-3 p-1">
      <div
        style={{
          ...styles.kpiCard,
          background: styles.kpiCard.background,
          opacity: 0.85,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              height: 18,
              width: "60%",
              borderRadius: 8,
              background: "linear-gradient(90deg,#1f2933,#4b5563,#1f2933)",
              backgroundSize: "200% 100%",
              animation: "skeleton-shimmer 1.2s ease-in-out infinite",
            }}
          />
          <div
            style={{
              ...styles.tagBase,
              width: 90,
              background:
                "linear-gradient(90deg,#374151,#6b7280,#374151)",
              color: "transparent",
              backgroundSize: "200% 100%",
              animation: "skeleton-shimmer 1.2s ease-in-out infinite",
            }}
          >
            &nbsp;
          </div>
        </div>

        <div>
          <div
            style={{
              height: 16,
              width: 80,
              borderRadius: 6,
              background: "rgba(148,163,184,0.4)",
              marginBottom: 8,
            }}
          />
          <div
            style={{
              height: 22,
              width: 70,
              borderRadius: 8,
              background:
                "linear-gradient(90deg,#047857,#22c55e,#047857)",
              backgroundSize: "200% 100%",
              animation: "skeleton-shimmer 1.2s ease-in-out infinite",
              marginBottom: 14,
            }}
          />
          <div
            style={{
              height: 16,
              width: 80,
              borderRadius: 6,
              background: "rgba(148,163,184,0.4)",
              marginBottom: 8,
            }}
          />
          <div
            style={{
              height: 22,
              width: 70,
              borderRadius: 8,
              background:
                "linear-gradient(90deg,#c2410c,#f97316,#c2410c)",
              backgroundSize: "200% 100%",
              animation: "skeleton-shimmer 1.2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.cardContainer}>
        <h2
          style={{
            color: "#043b2d",
            fontWeight: 800,
            fontSize: "35px",
            marginBottom: "12px",
            letterSpacing: "-0.02em",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Forecast Comparisons
        </h2>

        <p
          style={{
            color: "#06624b",
            marginBottom: "60px",
            fontSize: "20px",
            fontWeight: 500,
            letterSpacing: "0.5px",
            fontFamily: "Inter, sans-serif",
            fontStyle: "italic",
          }}
        >
          Comparative analysis of Actual, Predicted, and Forecasted performance
        </p>

        {/* Cards / skeleton area */}
        {/* Cards / skeleton area: slider always mounted */}
        <Slider {...sliderSettings}>
          {(loadingCards ? [0, 1, 2] : cardData).map((item, index) => {
            const card = loadingCards
              ? { title: "", model_name: "", train_mape: null, test_mape: null }
              : item;

            return (
              <div className="mx-3 p-1" key={index}>
                <div
                  style={{
                    ...styles.kpiCard,
                    width: 420,          // 👈 fixed width
                    maxWidth: 420,
                    ...(hovered === index && !loadingCards
                      ? {
                        transform: "translateY(-8px)",
                        boxShadow:
                          "0 20px 40px rgba(241,94,34,0.32), 0 12px 28px rgba(241,94,34,0.22), 0 4px 12px rgba(241,94,34,0.14)",
                      }
                      : {}),
                  }}
                  onMouseEnter={() => !loadingCards && setHovered(index)}
                  onMouseLeave={() => !loadingCards && setHovered(null)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {/* Title */}
                    {loadingCards ? (
                      <div
                        style={{
                          height: 18,
                          width: "60%",
                          borderRadius: 8,
                          background:
                            "linear-gradient(90deg,#1f2933,#4b5563,#1f2933)",
                          backgroundSize: "200% 100%",
                          animation: "skeleton-shimmer 1.2s ease-in-out infinite",
                        }}
                      />
                    ) : (
                      <h3
                        style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {card.title}
                      </h3>
                    )}

                    {/* Model tag */}
                    <span
                      style={{
                        ...styles.tagBase,
                        background: "#FFF5E0",
                        color: loadingCards ? "transparent" : "#F57C00",
                        boxShadow:
                          !loadingCards && hoverTag === index
                            ? "0 0 12px 2px rgba(255,184,77,0.6)"
                            : styles.tagBase.boxShadow,
                        fontFamily: "Inter, sans-serif",
                      }}
                      onMouseEnter={() => !loadingCards && setHoverTag(index)}
                      onMouseLeave={() => !loadingCards && setHoverTag(null)}
                    >
                      {loadingCards ? (
                        <span
                          style={{
                            display: "inline-block",
                            height: 12,
                            width: 50,
                            borderRadius: 999,
                            background:
                              "linear-gradient(90deg,#fed7aa,#f97316,#fed7aa)",
                            backgroundSize: "200% 100%",
                            animation: "skeleton-shimmer 1.2s ease-in-out infinite",
                          }}
                        />
                      ) : (
                        card.model_name
                      )}
                    </span>
                  </div>

                  <div>
                    <p style={{ ...styles.label, fontFamily: "Inter, sans-serif" }}>
                      Train MAPE
                    </p>
                    {loadingCards ? (
                      <div
                        style={{
                          height: 20,
                          width: 60,
                          borderRadius: 8,
                          background:
                            "linear-gradient(90deg,#047857,#22c55e,#047857)",
                          backgroundSize: "200% 100%",
                          animation: "skeleton-shimmer 1.2s ease-in-out infinite",
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          ...styles.value,
                          color: "#00ffb3",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {card.train_mape?.toFixed(2)}%
                      </p>
                    )}

                    <p style={{ ...styles.label, fontFamily: "Inter, sans-serif" }}>
                      Test MAPE
                    </p>
                    {loadingCards ? (
                      <div
                        style={{
                          height: 20,
                          width: 60,
                          borderRadius: 8,
                          background:
                            "linear-gradient(90deg,#c2410c,#f97316,#c2410c)",
                          backgroundSize: "200% 100%",
                          animation: "skeleton-shimmer 1.2s ease-in-out infinite",
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          ...styles.value,
                          color: "#FF9800",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {card.test_mape?.toFixed(2)}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>


        <div style={{ marginTop: "60px", marginBottom: "40px" }}>
          {children}
        </div>

        <div style={{ marginTop: "40px", display: "flex", gap: "32px" }}>
          {["Actual vs Prediction", "MAPE Report", "Forecast Report"].map(
            (tab, idx) => {
              const isActive = activeTab === `Report${idx + 1}`;
              return (
                <div
                  key={tab}
                  onClick={() => changeMenu(`Report${idx + 1}`)}
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)"
                      : "#eaf6fa",
                    color: isActive ? "#fff" : "#032B4E",
                    boxShadow: isActive
                      ? "0 8px 25px rgba(3, 43, 78, 0.3)"
                      : "0 2px 8px rgba(3, 43, 78, 0.08)",
                    borderRadius: "20px",
                    padding: "24px 32px",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "18px",
                    cursor: "pointer",
                    transition: "all 0.25s",
                  }}
                >
                  <span
                    style={{
                      background: isActive ? "#f79658" : "#fff",
                      color: "#032B4E",
                      border: "2px solid #f79658",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "18px",
                    }}
                  >
                    {idx + 1}
                  </span>
                  {tab}
                </div>
              );
            }
          )}
        </div>

        <div style={{ marginTop: "32px" }}>
          {activeTab === "Report1" && (
            <Report1 Product={Product} Location={Location} />
          )}
          {activeTab === "Report2" && (
            <Report2 Product={Product} Location={Location} />
          )}
          {activeTab === "Report3" && (
            <Report3
              Product={Product}
              Location={Location}
              Workflow={Workflow}
            />
          )}
        </div>
      </div>

      {/* skeleton shimmer keyframes */}
      <style>
        {`
          @keyframes skeleton-shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </div>
  );
}
