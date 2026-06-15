import React, { useState, useEffect } from "react";
import { FaChartLine, FaHandshake, FaCubes, FaBell, FaUsers, FaBookOpen } from "react-icons/fa";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import { useMetrics } from "../contexts/MatricsContext";
import axios from "axios";
import AuthService from "../services/AuthService";
import { displayMessage } from "../Utils/helper";

const { REACT_APP_API_BASE_URL } = process.env;

// Animated bell icon component with on-load and hover animation
function AnimatedIcon({ Icon, style }) {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => {
            setAnimate(false);
        }, 100); // match animation duration
        return () => clearTimeout(timer);
    }, []);

    return (
        <Icon
            className={`kpi-icon ${animate ? "icon-animate-onload" : ""}`}
            style={style}
        />
    );
}

function KpiCard({ Icon, title, value, hasMarginTop = false }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{
                ...styles.kpiItem,
                ...(hovered ? styles.kpiItemHover : {}),
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <AnimatedIcon Icon={Icon} style={styles.kpiIcon} />
            <h4 style={styles.kpiItemH4}>{title}</h4>
            <p style={hasMarginTop ? styles.kpiValuewithMarginTop : styles.kpiValue}>
                {value}
            </p>
        </div>
    );
}

function InsightCard({ Icon, title, text, actionText, actionLink, onDelete, deleting }) {
    const [hovered, setHovered] = useState(false);

    const cardClass = [
        "insight-card",
        deleting ? "insight-card-deleting" : "",
        hovered && !deleting ? "insight-card-hover" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className={cardClass}
            style={{
                ...styles.insightFeedItem,
                position: "relative",
            }}
            onMouseEnter={() => !deleting && setHovered(true)}
            onMouseLeave={() => !deleting && setHovered(false)}
        >
            {/* Close / dismiss button */}
            <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                style={{
                    position: "absolute",
                    top: 8,
                    right: 10,
                    border: "none",
                    background: "transparent",
                    color: deleting ? "#6B7280" : "#9CA3AF",
                    cursor: deleting ? "default" : "pointer",
                    fontSize: 20,
                    fontWeight: 700,
                    lineHeight: 1,
                }}
                aria-label="Dismiss notification"
            >
                ×
            </button>

            <Icon style={styles.insightFeedIcon} />
            <div>
                <span style={styles.insightFeedText}>{text}</span>
                <Link
                    to={actionLink}
                    style={
                        actionText.props.children[0].includes("Review Now")
                            ? styles.insightFeedActionReview
                            : styles.insightFeedActionPerformance
                    }
                >
                    {actionText}
                </Link>
            </div>
        </div>
    );
}

function ActionCard({ title, text, btnText, btnLink, isAccent }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{
                ...styles.actionCard,
                ...(hovered ? styles.actionCardHover : {}),
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <h3 style={styles.actionCardHeading}>{title}</h3>
            <p style={styles.actionCardText}>{text}</p>
            <Link
                to={btnLink}
                style={{ ...styles.actionBtn, ...(isAccent ? styles.actionBtnAccent : {}) }}
                aria-label={btnText}
            >
                {btnText}
            </Link>
        </div>
    );
}

function mapNotificationToInsight(n) {
    const uploadedByName = n.uploaded_by || "Someone";
    const workflow_name = n.workflow_name || "New Workflow";
    const workflowId = n.workflow_id; // assumes backend sends this

    if (n.task_name === "model_runs_to_review") {
        return {
            Icon: FaUsers,
            title: "Model Runs to Review",
            text: (
                <>
                    <b>Model Runs to Review:</b>
                    {/* <span style={styles.actionCardText}> Your new </span> */}
                    <span
                        className="mx-2"
                        style={{ color: "#5E6775", fontWeight: "bold" }}
                    >
                        {workflow_name}
                    </span>
                    model run initiated by the planner has
                    finished processing and is now awaiting their analysis.
                </>
            ),
            actionText: (
                <>
                    Review Now <IoIosArrowDroprightCircle style={{ marginTop: 2 }} />
                </>
            ),
            actionLink: `/workflow?workflow_id=${workflowId}`,
        };
    }

    if (n.task_name === "consensus_plans_to_finalize") {
        if (n.reviewed_get_fp === false) {
            return {
                Icon: FaHandshake,
                title: "Collaboration Insight",
                text: (
                    <>
                        <b>Collaboration Insight:</b>
                        <span
                            style={{ color: "#5E6775", fontWeight: "bold" }}
                        >
                            {uploadedByName}{" "}
                        </span>
                        has added new inputs on a
                        <span
                            className="mx-2"
                            style={{ color: "#5E6775", fontWeight: "bold" }}
                        >
                            {workflow_name}
                        </span>
                        and you haven’t reviewed their message yet.
                    </>
                ),
                actionText: (
                    <>
                        Review Now <IoIosArrowDroprightCircle style={{ marginTop: 2 }} />
                    </>
                ),
                actionLink: `/wf/comparison?workflow_id=${workflowId}`,
            };
        }

        return {
            Icon: FaChartLine,
            title: "Consensus Plan Ready",
            text: (
                <>
                    <b>Consensus Plan Ready:</b>
                    A consensus plan
                    <span
                        className="mx-2"
                        style={{ color: "#5E6775", fontWeight: "bold" }}
                    >
                        {workflow_name}
                    </span>
                    has received all required
                    sales inputs and is ready for your final approval.
                </>
            ),
            actionText: (
                <>
                    Finalize Plan <FaBookOpen style={{ marginTop: 2 }} />
                </>
            ),
            actionLink: `/wf/comparison?workflow_id=${workflowId}`,
        };
    }

    return null;
}

function Dashboard() {
    const { metrics, loading, refreshing, fetchMetrics } = useMetrics();
    const [isExpanded, setIsExpanded] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [deletingIds, setDeletingIds] = useState(new Set());

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    // sync local notifications when metrics change
    useEffect(() => {
        if (metrics?.notifications) {
            setNotifications(metrics.notifications.sort((a, b) => b.id - a.id)); // newest first
        }
    }, [metrics]);

    const handleDismissNotification = async (id) => {
        // optimistic: mark deleting (triggers slide-left animation)
        setDeletingIds((prev) => new Set(prev).add(id));

        try {
            await axios.delete(`${REACT_APP_API_BASE_URL}/notifications/${id}`, {
                headers: {
                    Authorization: AuthService.getAccessToken(),
                    access_token: AuthService.getAccessToken(),
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            // after animation duration (~250ms), remove from local state
            setTimeout(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            }, 260);
        } catch (e) {
            console.error("Failed to dismiss notification", e);
            displayMessage("danger", "Failed to dismiss notification");
            // revert deleting state
            setDeletingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    if (loading) {
        // full-page loader only for first-time load (no cached data)
        return (
            <div
                style={{
                    display: "flex",
                    height: "60vh",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div>Loading metrics...</div>
            </div>
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <div style={styles.inner}>
                    {/* Stylish Welcome Text */}
                    <div
                        style={{
                            fontFamily: "Alegreya, serif",
                            fontWeight: 800,
                            fontSize: 40,
                            color: "#0F1116",
                            marginBottom: 10,
                            letterSpacing: 1.2,
                            textShadow: "0 2px 8px rgba(3,43,78,0.10)",
                            textAlign: "left",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "'Playfair Display', 'Times New Roman', serif",
                                fontStyle: "italic",
                                fontWeight: 700,
                                fontSize: "40px",
                                letterSpacing: "0.06em",
                                // textShadow: "0 3px 12px rgba(0,0,0,0.55)",
                                padding: "4px 0px",
                                borderRadius: "6px",
                                marginLeft: "-5px",
                            }}
                        >
                            Welcome to Demand Edge
                        </span>
                    </div>
                    <header style={styles.header}>
                        <h1 style={styles.headerH1}>KPI Scoreboard </h1>
                    </header>

                    <section style={styles.kpiGrid}>
                        <KpiCard
                            Icon={FaChartLine}
                            title="Model Accuracy"
                            value={metrics?.forecast_accuracy?.forecast_accuracy ? `${metrics.forecast_accuracy.forecast_accuracy}%` : "N/A"}
                        />
                        <KpiCard
                            Icon={FaHandshake}
                            title="Sales Collaboration Index"
                            value={
                                metrics?.sales_collab?.sales_collaboration_index?.collaboration_percentage
                                    ? `${Math.min(100, metrics.sales_collab.sales_collaboration_index.collaboration_percentage)}%`
                                    : "N/A"
                            } />
                        <KpiCard
                            Icon={FaCubes}
                            title="Active Forecast Models"
                            value="6"
                            hasMarginTop={true}
                        />
                        <KpiCard
                            Icon={FaBell}
                            title="Pending Actions"
                            value={notifications?.length || 0}
                            hasMarginTop={true}
                        />
                    </section>

                    <section style={styles.actionGrid}>
                        <ActionCard
                            title="Craft New Forecast Scenarios"
                            text="Leverage your data to predict future demand using the guided model builder."
                            btnText="Start Building"
                            btnLink="/CreateWorkflow"
                        />
                        <ActionCard
                            title="Forecast Library"
                            text="Translate your forecast into actionable inventory and supply plans.     "
                            btnText="Go to Library"
                            btnLink="/ManageWorkflow"
                            isAccent
                        />
                        <ActionCard
                            title="Sales Collaboration"
                            text="Collaborate with Sales and other teams to align on a final demand plan."
                            btnText="Start Planning"
                            btnLink="/comparison"
                        />
                        <ActionCard
                            title="Inventory Optimization"
                            text="Translate your forecast into an actionable inventory and supply plan."
                            btnText="Optimize Inventory"
                            btnLink="/Indentation"
                            isAccent
                        />
                    </section>


                    <div style={styles.insightFeedHeader}>
                        <span style={styles.insightFeedTitle}>Proactive Insight Feed</span>
                        {notifications?.length > 3 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                style={{
                                    ...styles.expandButton,
                                    ...(isExpanded ? styles.expandButtonActive : {}),
                                }}
                            >
                                {isExpanded
                                    ? "See Less"
                                    : `See More (${notifications.length - 3})`}
                            </button>
                        )}
                    </div>

                    {/* Empty state vs list */}
                    {!notifications || notifications.length === 0 ? (
                        <div
                            style={{
                                marginTop: 12,
                                padding: "20px 24px",
                                borderRadius: 12,
                                border: "1px dashed rgba(148, 163, 184, 0.8)",
                                background:
                                    "linear-gradient(135deg, rgba(15,23,42,0.02), rgba(148,163,184,0.06))",
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                            }}
                        >
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "999px",
                                    background: "#032B4E",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#FACC6B",
                                    fontWeight: 700,
                                    fontSize: 20,
                                }}
                            >
                                !
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 14,
                                        color: "#0F172A",
                                        marginBottom: 4,
                                    }}
                                >
                                    No proactive insights yet
                                </div>
                                <div
                                    style={{
                                        fontSize: 13,
                                        color: "#6B7280",
                                    }}
                                >
                                    As new forecasts run and collaboration events happen, important
                                    alerts and recommendations will appear here automatically.
                                </div>
                            </div>
                        </div>
                    ) : (
                        // existing list rendering for notifications goes here
                        <div style={styles.insightFeedList}>
                            {notifications?.length > 0 &&
                                notifications
                                    .slice(0, isExpanded ? notifications.length : 3)
                                    .map((n) => {
                                        const insight = mapNotificationToInsight(n);
                                        if (!insight) return null;

                                        return (
                                            <InsightCard
                                                key={n.id}
                                                Icon={insight.Icon}
                                                text={insight.text}
                                                actionText={insight.actionText}
                                                actionLink={insight.actionLink}
                                                deleting={deletingIds.has(n.id)}
                                                onDelete={() => handleDismissNotification(n.id)}
                                            />
                                        );
                                    })}
                        </div>
                    )}

                </div>
            </div>

            {/* CSS animations and hover effects */}
            <style>
                {`
    @keyframes swing {
      0%   { transform: rotate(0deg); }
      20%  { transform: rotate(-18deg); }
      40%  { transform: rotate(16deg); }
      60%  { transform: rotate(-12deg); }
      80%  { transform: rotate(8deg); }
      100% { transform: rotate(0deg); }
    }

    .kpi-icon {
      transition: transform 0.2s ease, filter 0.2s ease;
      cursor: pointer;
      animation: pulse 3s ease-in-out infinite;
    }

    .icon-animate-onload {
      animation: swing 0.7s cubic-bezier(.36,.07,.19,.97) forwards;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(1.1); }
    }

    @keyframes spin {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Base notification card */
    .insight-card {
      transition:
        transform 0.25s ease,
        opacity 0.25s ease,
        margin 0.25s ease,
        max-height 0.25s ease;
      max-height: 200px;
    }

    /* Hover (lift up slightly) */
    .insight-card-hover {
      transform: translateY(-4px);
    }

    /* Deleting: slide left + collapse */
    .insight-card-deleting {
      transform: translateX(-40px);
      opacity: 0;
      max-height: 0;
      margin-top: 0;
      margin-bottom: 0;
    }
  `}
            </style>

        </div>
    );
}

export default Dashboard;

const styles = {
    wrapper: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
        padding: "60px 0",
        boxSizing: "border-box",
    },
    card: {
        width: "95%",
        maxWidth: 1500,
        background: "#fbfcf7ff",
        padding: "40px 40px 60px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        border: "1px solid #475C7E",
        overflow: "hidden",
    },
    inner: {
        width: "100%",
        margin: "0 auto",
        color: "#0d1b4c",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    header: {
        marginBottom: 15,
        marginTop: 15,
    },
    headerH1: {
        fontSize: 30,
        fontWeight: 600,
        color: "#0F1116",
        display: "flex",
        marginTop: 0,
        fontFamily: "Poppins, sans-serif",
    },
    headerP: {
        fontSize: 14,
        color: "#444",
        display: "flex",
        fontFamily: "Inter, sans-serif",
    },
    kpiGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 24,
        justifyItems: "center",
        alignItems: "stretch",
        width: "100%",
        marginTop: 15,
    },
    kpiItem: {
        background: "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
        borderRadius: 14,
        padding: "32px 20px",
        textAlign: "center",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        color: "#ffffff",
        boxShadow:
            "0 12px 32px rgba(0,0,0,0.2), 0 6px 18px rgba(29,43,122,0.3)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 260,
        height: 260,
        width: "100%",
        boxSizing: "border-box",
        cursor: "default",
    },
    kpiIcon: {
        fontSize: 90,
        color: "#c79838",
        marginBottom: 12,
        flexShrink: 0,
    },
    kpiItemH4: {
        fontSize: 18,
        fontWeight: 600,
        color: "#e1e4f2",
        marginBottom: 8,
        textAlign: "center",
        minHeight: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
    },
    kpiValue: {
        fontSize: 40,
        fontWeight: 600,
        color: "#ffffff",
        marginTop: 8,
        lineHeight: 1,
        fontFamily: "Poppins, sans-serif",
    },
    kpiValuewithMarginTop: {
        fontSize: 40,
        fontWeight: 600,
        color: "#ffffff",
        marginTop: 8,
        lineHeight: 1,
        fontFamily: "Poppins, sans-serif",
    },
    kpiItemHover: {
        transform: "translateY(-8px)",
        boxShadow:
            "0 20px 40px rgba(241,94,34,0.32), 0 12px 28px rgba(241,94,34,0.22), 0 4px 12px rgba(241,94,34,0.14)",
    },
    actionGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 22,
        marginTop: 46,
        marginBottom: 46,
    },
    actionCard: {
        background: "#fff",
        padding: 22,
        borderRadius: 12,
        border: "2px solid #475C7E",
        boxShadow: "0 6px 18px rgba(71,92,126,0.2)",
        textAlign: "left",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "default",
    },
    actionCardHover: {
        transform: "scale(1.03)",
        boxShadow: "0 12px 32px rgba(71,92,126,0.35)",
    },
    actionCardHeading: {
        fontSize: 22,
        fontWeight: 600,
        margin: "0 0 8px 0",
        color: "#0F1116",
        letterSpacing: 0.6,
        fontFamily: "Poppins, sans-serif",
    },
    actionCardText: {
        fontSize: 14,
        fontWeight: 400,
        color: "#5E6775",
        margin: "0 0 18px 0",
        lineHeight: 1.6,
        fontFamily: "Inter, sans-serif",
    },
    actionBtn: {
        display: "inline-block",
        padding: "10px 18px",
        borderRadius: 8,
        textDecoration: "none",
        color: "#fff",
        fontWeight: 500,
        fontSize: 14,
        transition: "transform 0.12s ease, box-shadow 0.12s ease",
        boxShadow: "0 6px 14px rgba(15,23,42,0.06)",
        background: "#b8842f",
        marginRight: 8,
        fontFamily: "Inter, sans-serif",
    },
    actionBtnAccent: {
        color: "#fff",
    },
    insightFeedHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
    },
    insightFeedTitle: {
        fontSize: 28,
        fontWeight: 600,
        color: "#0F1116",
        letterSpacing: 0.2,
        display: "flex",
        alignItems: "center",
        fontFamily: "Poppins, sans-serif",
    },
    insightFeedViewAll: {
        color: "#0F1116",
        fontWeight: 500,
        textDecoration: "none",
        fontSize: 16,
        borderBottom: "1.5px solid #1F4280",
        transition: "color 0.2s",
        fontFamily: "Inter, sans-serif",
    },
    insightFeedList: {
        display: "flex",
        flexDirection: "column",
        gap: 18,
    },
    insightFeedItem: {
        display: "flex",
        alignItems: "flex-start",
        background: "#fff",
        borderRadius: 10,
        padding: "16px 18px",
        boxShadow:
            "0 8px 24px rgba(32,43,112,0.12), 0 4px 12px rgba(0,0,0,0.08)",
        marginBottom: 2,
        borderLeft: "8px solid",
        borderRight: "8px solid",
        borderImage: "linear-gradient(to bottom, #032B4E, #b8842f) 1 100%",
        gap: 16,
        cursor: "pointer",
    },

    insightFeedItemHover: {
        // leave boxShadow only, no transform here
        boxShadow:
            "0 16px 32px rgba(32,43,112,0.18), 0 8px 16px rgba(0,0,0,0.12)",
    },
    insightFeedIcon: {
        fontSize: 48,
        color: "#c79838",
        marginRight: 10,
        marginTop: 2,
        flexShrink: 0,
        position: "relative",
        top: 15,
    },
    insightFeedText: {
        fontSize: 16,
        color: "#0F1116",
        fontWeight: 400,
        display: "block",
        marginBottom: 6,
        lineHeight: 1.6,
        fontFamily: "Inter, sans-serif",
    },
    insightFeedActionReview: {
        color: "#ffffff",
        fontWeight: 500,
        fontSize: 14,
        marginLeft: 4,
        transition: "all 0.25s ease-in-out",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "#368E60",
        borderRadius: 8,
        padding: "10px 16px",
        boxShadow: "0 4px 14px rgba(32,43,112,0.15)",
        cursor: "pointer",
        textDecoration: "none",
        fontFamily: "Inter, sans-serif",
    },
    insightFeedActionPerformance: {
        color: "#ffffff",
        fontWeight: 500,
        fontSize: 14,
        marginLeft: 4,
        transition: "all 0.25s ease-in-out",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "#368E60",
        borderRadius: 8,
        padding: "10px 16px",
        boxShadow: "0 4px 14px rgba(32,43,112,0.15)",
        cursor: "pointer",
        textDecoration: "none",
        fontFamily: "Inter, sans-serif",
    },
    insightFeedActionHover: {
        background: "#7aceb6 !important",
        color: "#fff!important",
        boxShadow: "0 4px 16px rgba(32, 43, 112, 0.12)",
        textDecoration: "none!important",
    },
    expandButton: {
        marginTop: 20,
        padding: "12px 24px",
        background: "#b8842f",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 14px rgba(15,23,42,0.1)",
        fontFamily: "Inter, sans-serif",
        letterSpacing: 0.5,
    },
    expandButtonActive: {
        background: "#a67a2a",
        boxShadow: "0 6px 18px rgba(15,23,42,0.15)",
    },
};
