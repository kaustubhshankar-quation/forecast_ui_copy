import React from "react";
import styled from "styled-components";

function TableComponent({ data }) {
  if (!data || !data.Forecast?.length) return null;

  const columns = Object.keys(data.Forecast[0]);

  const rowConfig = [
    { key: "Forecast", label: "Forecast" },
    { key: "Opening Inventory", label: "Opening Inventory" },
    { key: "Quantity to be ordered", label: "Quantity to be ordered" },
    {
      key: "Quantity to be ordered (EOQ)",
      label: "Quantity to be ordered post adjusting for EOQ and Safety Stock",
    },
    { key: "Closing Inventory", label: "Closing Inventory" },
  ];

  return (
    <Wrapper>
      <Card>
        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th className="header-left">UNITS \\ WEEKS</th>
                {columns.map((col) => (
                  <th key={col} className="header-cell">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rowConfig.map((row, idx) => {
                const rowData = data[row.key];
                if (!rowData || !Array.isArray(rowData)) return null;

                const isLast = idx === rowConfig.length - 2;

                return (
                  <tr key={row.key} className={isLast ? "highlight-row" : ""}>
                    <td className={`row-title ${isLast ? "highlight-title" : ""}`}>
                      {row.label}
                    </td>

                    {columns.map((col) => (
                      <td
                        key={col}
                        className={`data-cell ${isLast ? "highlight-cell" : ""}`}
                      >
                        {rowData[0]?.[col] ?? "-"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </Wrapper>
  );
}

export default TableComponent;

const Wrapper = styled.div`
  width: 100%;
  padding: 24px 40px;
  background: #f3f4f6;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  width: 100%;
  max-width: 1500px;
  background: #ffffff;
  border-radius: 16px;
  border: 3px solid #032b4e;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  padding: 0;
  overflow: hidden;
  font-family: "Inter", sans-serif;

  .table-container {
    width: 100%;
    overflow-x: auto;
  }

  .inventory-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    color: #111827;
    background: #ffffff;
  }

  thead {
    background-color: #032b4e;
    color: #ffffff;
    font-family: "Poppins", sans-serif;
    font-weight: 600;
    font-size: 18px;
    text-transform: uppercase;
    }
    
    th {
      padding: 16px 24px;
      text-align: center;
      font-size: 15px;
    border-right: 2px solid rgba(255, 255, 255, 0.1);
  }

  th:last-child {
    border-right: none;
  }

  .header-left {
    font-weight: 600;
    font-size: 15px;
  }

  .header-cell {
    font-weight: 600;
    font-size: 15px;
  }

  tbody {
    background: #ffffff;
    font-family: "Inter", sans-serif;
    font-size: 13px;
    font-weight: 400;
  }

  tbody tr {
    border-bottom: 1px solid #e0e0e0;
    transition: background-color 0.2s ease;
  }

  tbody tr:last-child {
    border-bottom: none;
  }

  tbody tr:hover {
    background-color: #f9fafb;
  }

  td {
    padding: 20px 24px;
    text-align: center;
    border-right: 1px solid #e0e0e0;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    font-family: "Inter", sans-serif;
  }

  td:last-child {
    border-right: none;
  }

  .row-title {
    font-weight: 600;
    color: #111827;
    white-space: nowrap;
  }

  .data-cell {
    font-weight: 600;
  }

  /* last row subtle highlight like quantity row, but still flat */
  .highlight-row {
    background-color: #fff7ed;
  }

  .highlight-title {
    color: #b45309;
  }

  .highlight-cell {
    color: #b45309;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: 12px 14px;
      font-size: 12px;
    }
  }
`;
