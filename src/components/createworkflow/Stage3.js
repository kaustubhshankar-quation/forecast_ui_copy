import React, { useContext } from 'react';
import '../../assets/css/viewtrree.css';
import Stage3DataPanel from './Stage3DataPanel';
import { DataContext } from './DataContext';
import { ErrorBoundary } from '../common/ErrorBoundary';
import Loader from '../common/Loader';
import MenuContext from './MenuContext'; // ✅ added

export default function Stage3() {
    const { products, geography, isloading } = useContext(DataContext);
    const { setActiveTab } = useContext(MenuContext); // ✅ added

    if (isloading) {
        return (
            <ErrorBoundary>
                <div className="loader-wrapper">
                    <Loader size="large" />
                </div>
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary>
            <div style={styles.wrapper}>
                <div style={styles.card}>
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-start mb-8">
                        {[1, 2, 3, 4, 5, 6, 7].map((step, index) => (
                            <React.Fragment key={step}>
                                <div
                                    className={`flex items-center justify-center rounded-full ${step === 3 ? 'bg-[#032B4E] text-white' : 'bg-gray-200 text-gray-600'
                                        }`}
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        border: step === 3 ? '2px solid #032B4E' : '2px solid #d1d5db'
                                    }}
                                >
                                    {step}
                                </div>
                                {index < 6 && (
                                    <div
                                        className={`h-0.5 ${step < 3 ? 'bg-[#032B4E]' : 'bg-gray-300'}`}
                                        style={{ width: '40px' }}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <h2 className="text-[30px] text-[#0F1116] text-left mb-8" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                        Step 3: Define Dimensions
                    </h2>


                    {/* Product Hierarchy Row */}
                    <Stage3DataPanel
                        zone={{
                            zoneId: 1,
                            zoneName: 'Product Categories',
                            // icon: '📦'
                        }}
                        hierarchyData={products?.data || []}
                    />

                    {/* Geographic Hierarchy Row */}
                    <Stage3DataPanel
                        zone={{
                            zoneId: 2,
                            zoneName: 'Geographic Regions',
                            icon: '🌐'
                        }}
                        hierarchyData={geography?.data || []}
                    />

                    {/* ✅ Navigation Buttons */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30 }}>
                        <button
                            onClick={() => setActiveTab("Stage2")}
                            className="px-8 py-2.5 bg-[#b8842f] hover:bg-[#a67d2e] text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
                            style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}
                        >
                            ← Back
                        </button>

                        <button
                            onClick={() => setActiveTab("Stage4")}
                            className="px-8 py-2.5 rounded-lg bg-[#b8842f] text-white hover:bg-[#a67d2e] shadow-lg hover:shadow-xl flex items-center gap-2 transition-all"
                            style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}

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
};
