import React, { useState, useEffect } from 'react';
import Breadcrumb from '../common/Breadcrumb';
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { displayMessage } from '../../Utils/helper';
import { getWorkkflowCombinations } from '../../services/ApiManageWorkflow';
import { getOrderDetails } from '../../services/ApiIndentation';
import TableComponent from './TableComponent';
import GraphComponent from './GraphComponent';
import styled from "styled-components";

function IndentationPage() {
    const { state } = useLocation();
    const [combinations, setCombinations] = useState([]);
    const [safetystock, setSafetystock] = useState(null);
    const [eoq, setEOQ] = useState(null);
    const [ReportData, setReportData] = useState(null);

    useEffect(() => {
        const init = async () => {
            const data = await getWorkkflowCombinations(state?.workflow?.workflow_id);
            setCombinations(data || []);
        };
        init();
    }, [state?.workflow?.workflow_id]);

    function getFormattedPath(obj) {
        const levels = ["level1", "level2", "level3", "level4", "level5"];
        const path = [];
        for (let key of levels) {
            if (!obj[key]) break;
            path.push(obj[key]);
        }
        return path.join("/");
    }

    const options = combinations.map(ob => ({
        label: `${ob.sku_name} - ${getFormattedPath(ob)}`,
        value: {
            sku_name: ob.sku_name,
            location: getFormattedPath(ob),
            sku_id: ob.sku_id
        }
    }));

    const combinationSelectChangeHandler = async (selected) => {
        try {
            const result = await getOrderDetails(selected?.value?.sku_name, state?.workflow?.workflow_id);
            if (result !== undefined) {
                setSafetystock(result[selected?.value?.sku_name][0]['Safety_Stock']);
                setEOQ(result[selected?.value?.sku_name][0]['EOQ']);
                setReportData(result.Values);
            }
        } catch (err) {
            console.error(err);
            setEOQ(null);
            setSafetystock(null);
            setReportData(null);
            displayMessage("danger", "Error", "Error occurred while fetching details");
        }
    };

    return (
        <>
            <Breadcrumb
                List={[
                    { path: "/Dashboard", name: "Dashboard" },
                    { path: "/indentation", name: "Inventory Optimization" },
                    { path: "#", name: state?.workflow?.workflow_name }
                ]}
            />
            <Wrapper>
                <Card>
                    <HeaderSection style={{ textAlign: 'left', paddingLeft: '20px' }}>
                    <h2 style={{
                        fontSize: "35px",
                        fontWeight: "600",
                        color: "#0F1116",
                        marginBottom: "12px",
                        fontFamily: "Poppins, sans-serif"
                    }}>Inventory Optimization Report</h2>
                    <p style={{
                        fontSize: "18px",
                        color: "#6B7280",
                        marginBottom: "40px",
                        fontFamily: "Inter, sans-serif",
                        fontStyle: "italic",
                        fontWeight: "400"
                    }}>User can find the details of Inventory Optimization here</p>
                </HeaderSection>

                {/* Combination Selector & Buttons */}
                <TopRow>
                    <div className="left">
                        <label>Combination</label>
                        <StyledSelect
                            closeMenuOnSelect={true}
                            onChange={combinationSelectChangeHandler}
                            options={options}
                            placeholder="Select SKU / Location"
                            isSearchable
                        />
                    </div>
                    <div className="right">
                        <button className="metric-btn">EOQ : {eoq ?? "--"}</button>
                        <button className="metric-btn">Safety Stock : {safetystock ?? "--"}</button>
                        <button className="export-btn">Export</button>
                    </div>
                </TopRow>

                {/* Reports Section */}
                {!ReportData ? (
                    <EmptyState>
                        <div style={{
                            padding: '40px',
                            textAlign: 'center',
                            color: '#6B7280',
                            fontSize: '16px',
                            fontFamily: 'Inter, sans-serif'
                        }}>
                            <p>Please select a combination to view the report</p>
                        </div>
                    </EmptyState>
                ) : (
                    <>
                        <Section>
                            {/* <h3 style={{ fontFamily: 'Poppins, sans-serif' }}>Tabular Report</h3> */}
                            <TableComponent data={ReportData} />
                        </Section>

                        <Section>
                            <GraphComponent data={ReportData} />
                        </Section>
                    </>
                )}
            </Card>
        </Wrapper>
        </>
    );
}

const EmptyState = styled.div`
    background: #f8fafc;
    border: 2px dashed #e2e8f0;
    border-radius: 16px;
    margin: 20px 0;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default IndentationPage;

// ---------------- Styled Components ----------------

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 60px 0;
  background: linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%);
`;

const Card = styled.div`
  width: 95%;
  max-width: 1500px;
  background: #ffffff;
  padding: 50px 60px 80px;
  box-shadow: 0 12px 35px rgba(0,0,0,0.2);
  overflow: hidden;
  border: 2px solid #1F4280;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h2 {
    font-size: 34px;
    font-weight: 800;
    color: #032B4E;
    letter-spacing: 0.5px;
  }

  p {
    font-size: 16px;
    color: #1e293b;
    margin-top: 8px;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 60px;

  .left {
    flex: 1 1 45%;
    display: flex;
    flex-direction: column;
  }

  label {
    font-weight: 600;
    color: #0F1116;
    margin-bottom: 10px;
    font-size: 18px;
    font-family: 'Poppins', sans-serif;
  }

  .right {
    flex: 1 1 45%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
  }

  .metric-btn {
    background: #032B4E;
    color: #fff;
    font-weight: 600;
    border: none;
    padding: 12px 22px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    cursor: default;
    transition: all 0.3s ease;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
  }

  .export-btn {
    background: #b8842f;
    color: #ffffff;
    font-weight: 600;
    border: none;
    padding: 12px 26px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.25s ease;
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
    font-size: 16px;
    font-family: 'Inter', sans-serif;
  }

  .export-btn:hover {
    background: #a67d2e;
    transform: scale(1.05);
  }
`;

const StyledSelect = styled(Select)`
  .react-select__control {
    border-radius: 10px !important;
    border: 2px solid #1F4280 !important;
    box-shadow: none !important;
    transition: all 0.25s ease !important;
    font-weight: 500;
    font-size: 16px;
    font-family: 'Inter', sans-serif;
  }

  .react-select__control:hover {
    border-color: #032B4E !important;
    box-shadow: 0 0 8px rgba(31, 66, 128, 0.5);
  }

  .react-select__menu {
    border-radius: 10px;
    overflow: hidden;
  }

  .react-select__option {
    font-weight: 400;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
  }

  .react-select__option--is-focused {
    background: #e8f0ff !important;
    color: #032B4E !important;
  }

  .react-select__option--is-selected {
    background: #b8842f !important;
    color: #fff !important;
  }
`;

const Section = styled.div`
  text-align: center;
  margin-bottom: 70px;

  h3 {
    font-size: 28px;
    font-weight: 600;
    color: #0F1116;
    margin-bottom: 30px;
    font-family: 'Poppins', sans-serif;
  }
`;
