import React from "react";
import * as Image from "../../assets/images";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        width: "100%",
        background: "#E6F4EA",
        borderTop: "4px solid #E06639",
        boxShadow: "0 -6px 18px rgba(0,0,0,0.12)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "22px 24px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
        }}
      >
        {/* CENTER CONTENT */}
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <img
            src={Image.copyimg}
            alt="Quation"
            style={{
              height: "48px",          // ⬆ bigger logo
              objectFit: "contain",
            }}
          />

          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "2rem",        // ⬆ bigger text
              fontWeight: 600,
              color: "#070707",
              letterSpacing: "0.3px",
            }}
          >
            © 2025 Quation Solutions Pvt. Ltd. All rights reserved.
          </span>
        </div>

        {/* BACK TO TOP */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #E06639)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 14px rgba(230,111,81,0.35)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <iconify-icon
              icon="tabler:arrow-up"
              style={{ fontSize: "3.5rem", color: "#fff" }}
            />
          </button>

          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "1px",
              color: "#c64b2d",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Scroll To Top
          </span>
        </div>
      </div>
    </footer>
  );
}
