// DisplayExcel.js
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { zeroIfNegative } from "../../Utils/helper";

const DisplayExcel = ({ file, data, onEdit }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const buf = new Uint8Array(event.target.result);
        const workbook = XLSX.read(buf, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setTableData(jsonData);
        console.log("jsonData",jsonData);
        
      };
      reader.readAsArrayBuffer(file);
    } else if (data) {
      setTableData(data);
    }
  }, [file, data]);

  // edit cell
  const handleEdit = (rowIndex, colKey, newValue) => {
    const updated = [...tableData];
    updated[rowIndex][colKey] = newValue;
    setTableData(updated);
    if (onEdit) onEdit(updated);
  };

  return (
    <div className="overflow-x-auto table-responsive">
      {console.log("tabledataaaaa", tableData)}
      {tableData.length > 0 ? (
        <table className="table dataselectiontable table-bordered w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              {Object.keys(tableData[0]).map((key, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-4 py-2 text-left font-bold bg-[#0C3C54] text-white"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-100">
                {Object.entries(row).map(([colKey, value], colIndex) => (
                  <td key={colIndex} className="border border-gray-300 p-2">
                    {colKey === "workflow_name" || colKey === "sku" ? (
                      <span className="text-gray-700">{value}</span>
                    ) : (
                      <input
                        disabled={!data ? true : false}
                        type="text"
                        value={zeroIfNegative(value)}
                        onChange={(e) =>
                          handleEdit(rowIndex, colKey, e.target.value)
                        }
                        className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No data to display.</p>
      )}
    </div>
  );
};

export default DisplayExcel;