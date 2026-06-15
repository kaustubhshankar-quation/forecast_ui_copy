import React, { useState, useMemo } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

/* -------------------- ISSUE TYPE MAP -------------------- */

const issueTypeMap = {
  NEGATIVE_SALES: { label: "Negative Values" },
  FRACTIONAL_SALES: { label: "Fractional Sales" },
  ZERO_SALES: { label: "Zero Values" },
  OUTLIER: { label: "Outliers" },
  SPARSITY: { label: "Missing Data" },
  FLAT_LINING: { label: "Flat-lining" }
};

const qcTabs = [
  { id: "sparsity", label: "Nulls" },
  { id: "zero", label: "Zero" },
  { id: "outlier", label: "Outliers" },
  { id: "flat", label: "Flat-lining" },
  { id: "negative", label: "Negative" }
];

const { REACT_APP_API_BASE_URL } = process.env;
// const fresh_upload_id = uuidv4();
const fresh_upload_id = "new_id_123";

export default function Base() {
  const [activeSalesTab, setActiveSalesTab] = useState(null);

  const [loadingProduct, setLoadingProduct] = useState(false);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);

  const [productFile, setProductFile] = useState(null);
  const [geoFile, setGeoFile] = useState(null);
  const [salesFile, setSalesFile] = useState(null);

  const [productData, setProductData] = useState(null);
  const [geoData, setGeoData] = useState(null);

  const [salesSummary, setSalesSummary] = useState(null);
  const [salesProblemRows, setSalesProblemRows] = useState([]);

  const [committing, setCommitting] = useState(false);

  /* -------------------- PRODUCT QC -------------------- */

  const uploadProductHierarchy = async () => {
    if (!productFile) return alert("Select product hierarchy file");

    const fd = new FormData();
    fd.append("file", productFile);
    fd.append("data_upload_id", fresh_upload_id);
    fd.append("user_id", "a8a4e241-883d-4841-ab1d-437106654754");
    fd.append("file_type", "level");

    try {
      setLoadingProduct(true);
      const res = await axios.post(`${REACT_APP_API_BASE_URL}/qc/upload`, fd);
      setProductData(res.data);
    } catch {
      alert("Product hierarchy QC failed");
    } finally {
      setLoadingProduct(false);
    }
  };

  /* -------------------- GEO QC -------------------- */

  const uploadGeoHierarchy = async () => {
    if (!geoFile) return alert("Select geo hierarchy file");

    const fd = new FormData();
    fd.append("file", geoFile);
    fd.append("data_upload_id", fresh_upload_id);
    fd.append("user_id", "a8a4e241-883d-4841-ab1d-437106654754");
    fd.append("file_type", "geo");

    try {
      setLoadingGeo(true);
      const res = await axios.post(`${REACT_APP_API_BASE_URL}/qc/upload`, fd);
      setGeoData(res.data);
    } catch {
      alert("Geo hierarchy QC failed");
    } finally {
      setLoadingGeo(false);
    }
  };

  /* -------------------- SALES QC -------------------- */

  const uploadSalesData = async () => {
    if (!salesFile) return alert("Select sales file");

    const fd = new FormData();
    fd.append("file", salesFile);
    fd.append("data_upload_id", fresh_upload_id);
    fd.append("file_type", "sales");
    fd.append("user_id", "a8a4e241-883d-4841-ab1d-437106654754");
    fd.append("frequency", "monthly");

    try {
      setLoadingSales(true);
      const res = await axios.post(`${REACT_APP_API_BASE_URL}/qc/upload`, fd);

      setSalesSummary(res.data.summary);
      setSalesProblemRows(res.data.problem_rows || []);

      const issueKeys = Object.keys(res.data.summary.issue_types || {});
      setActiveSalesTab(issueKeys.length > 0 ? issueKeys[0] : null);
    } catch {
      alert("Sales QC failed");
    } finally {
      setLoadingSales(false);
    }
  };

  const filteredSalesRows = useMemo(() => {
    if (!activeSalesTab) return [];
    return salesProblemRows.filter(item =>
      item.issues.some(i => i.issue_type === activeSalesTab)
    );
  }, [salesProblemRows, activeSalesTab]);

  const handleCommitData = async () => {
    if (!salesSummary) return;

    try {
      setCommitting(true);

      await axios.post(
        `${REACT_APP_API_BASE_URL}/qc/commit-all`,
        {
          data_upload_id: fresh_upload_id,
          user_id: "a8a4e241-883d-4841-ab1d-437106654754",
          strategy: "append",
          require_green: true,
          lock_workflow: true
        }
      );

      alert("Data successfully committed to database");
    } catch (err) {
      alert("Commit failed. QC may not be GREEN.");
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#032B4E] p-10">
      <div className="bg-white rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-[#032B4E] mb-10">
          Quality Check Dashboard
        </h1>

        {/* ---------------- PRODUCT QC ---------------- */}

        <HierarchySection
          title="Product Hierarchy QC"
          description="Validate product hierarchy structure"
          fileSetter={setProductFile}
          onUpload={uploadProductHierarchy}
          loading={loadingProduct}
          data={productData}
          setData={setProductData}
          fileType="level"
        />

        {/* ---------------- GEO QC ---------------- */}

        <HierarchySection
          title="Geography Hierarchy QC"
          description="Validate geographic hierarchy structure"
          fileSetter={setGeoFile}
          onUpload={uploadGeoHierarchy}
          loading={loadingGeo}
          data={geoData}
          setData={setGeoData}
          fileType="geo"
        />

        {/* ---------------- SALES QC ---------------- */}

        <div className="mt-16">
          <h2 className="text-xl font-semibold text-[#032B4E] mb-2">
            Sales Data QC
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Statistical and time-series quality checks
          </p>

          <div className="border rounded-lg p-6 bg-gray-50 mb-8 flex justify-between">
            <input
              type="file"
              onChange={e => setSalesFile(e.target.files[0])}
            />
            <button
              onClick={uploadSalesData}
              className="px-4 py-2 bg-[#032B4E] text-white rounded"
            >
              Upload & Validate
            </button>
          </div>

          {loadingSales && <Loader />}

          {salesSummary && (
            <>
              {/* Metrics */}
              <div className="grid grid-cols-5 gap-4 mb-8">
                {Object.entries(issueTypeMap).map(([key, config]) => {
                  const count =
                    salesSummary.issue_types?.[key] || 0;

                  return (
                    <QCMetric
                      key={key}
                      title={config.label}
                      value={`${count} issues`}
                      status={count > 0 ? "fail" : "warn"}
                    />
                  );
                })}
              </div>

              {/* Tabs */}
              <div className="flex gap-3 mb-6">
                {Object.entries(salesSummary.issue_types)
                  .filter(([_, count]) => count > 0)
                  .map(([key]) => (
                    <button
                      key={key}
                      onClick={() => setActiveSalesTab(key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${activeSalesTab === key
                        ? "bg-[#032B4E] text-white"
                        : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {issueTypeMap[key]?.label || key}
                    </button>
                  ))}
              </div>

              {/* Issue Table */}
              {activeSalesTab && (
                <SalesIssueSection
                  rows={filteredSalesRows}
                  setRows={setSalesProblemRows}
                  issueType={activeSalesTab}
                />
              )}

              {/* ----------- FINAL COMMIT SECTION ----------- */}

              <div className="mt-10 border-t pt-8">
                <div className="flex justify-between items-center bg-gray-50 p-6 rounded-lg">
                  {/* Status + Score */}
                  <div>
                    <p className="text-sm text-gray-500">
                      Sufficiency Score
                    </p>
                    <p className="text-2xl font-semibold text-[#032B4E]">
                      {salesSummary.sufficiency_score}%
                    </p>

                    <p
                      className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded ${salesSummary.status === "GREEN"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      Status: {salesSummary.status}
                    </p>
                  </div>

                  {/* Commit Button */}
                  <button
                    onClick={handleCommitData}
                    // disabled={
                    //   committing ||
                    //   (salesSummary.status !== "GREEN")
                    // }
                    className={`px-6 py-3 rounded-lg text-white font-medium ${salesSummary.status === "GREEN"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {committing ? "Committing..." : "Finalize & Store Data"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- HIERARCHY SECTION (NEW LOGIC, OLD API) ---------------- */

function HierarchySection({
  title,
  description,
  fileSetter,
  onUpload,
  loading,
  data,
  setData,
  fileType
}) {
  const [editedRows, setEditedRows] = useState({});
  const [savingRow, setSavingRow] = useState(null);
  const [savedRows, setSavedRows] = useState({});

  const handleChange = (rowId, originalRow, field, value) => {
    setEditedRows(prev => ({
      ...prev,
      [rowId]: {
        ...(prev[rowId] || {}),
        [field]: value
      }
    }));

    // remove saved badge if edited again
    setSavedRows(prev => {
      if (!prev[rowId]) return prev;
      const copy = { ...prev };
      delete copy[rowId];
      return copy;
    });
  };

  const handleSave = async (row, col) => {
    const rowId = row.__row_id;
    const saveKey = `${rowId}-${col}`;

    // get only edited fields for this row
    const edited = editedRows[rowId];

    if (!edited) {
      alert("No changes to save");
      return;
    }

    // build minimal payload
    const payloadRow = {
      __row_id: rowId
    };

    Object.keys(edited).forEach(key => {
      if (key === "__row_id") return;

      let value = edited[key];

      // sanitize only id fields
      if (key.includes("_id")) {
        if (value === "" || value === null || value === undefined) {
          value = null;
        } else if (!isNaN(value)) {
          value = Number(value);
        }
      }

      payloadRow[key] = value;
    });

    try {
      setSavingRow(rowId);

      await axios.post(
        `${REACT_APP_API_BASE_URL}/qc/apply-rows`,
        {
          data_upload_id: fresh_upload_id,
          file_type: fileType,
          rows: [payloadRow] // ONLY changed fields
        }
      );

      // patch local UI
      setData(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          problem_rows: prev.problem_rows.map(item => {
            if (item.row.__row_id !== rowId) return item;

            return {
              ...item,
              row: {
                ...item.row,
                ...payloadRow
              }
            };
          })
        };
      });

      // mark saved
      setSavedRows(prev => ({
        ...prev,
        [saveKey]: true
      }));

      // clear edit buffer
      setEditedRows(prev => {
        const copy = { ...prev };
        delete copy[rowId];
        return copy;
      });

    } catch (err) {
      console.error(err);
      alert("Failed to apply fix");
    } finally {
      setSavingRow(null);
    }
  };

  return (
    <div className="mt-14">
      <h2 className="text-xl font-semibold text-[#032B4E]">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{description}</p>

      <div className="border rounded-lg p-6 bg-gray-50">
        <div className="flex justify-between mb-4">
          <input type="file" onChange={e => fileSetter(e.target.files[0])} />
          <button
            onClick={onUpload}
            className="px-4 py-2 bg-[#032B4E] text-white rounded"
          >
            Upload & Validate
          </button>
        </div>

        {loading && <Loader />}

        {!loading && data?.problem_rows?.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-[#032B4E] text-white">
              <tr>
                {/* <th className="p-3">Row ID</th> */}
                <th className="p-3">Level</th>
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Issue</th>
                <th className="p-3">Fix</th>
              </tr>
            </thead>
            <tbody>
              {data.problem_rows.flatMap(item =>
                item.issues.map((issue, idx) => {
                  const col = issue.column.split("|")[0];
                  const row = item.row;
                  const rowId = row.__row_id;
                  let idField = "";
                  let nameField = "";
                  let label = "";
                  const saveKey = `${rowId}-${col}`;

                  const match = col.match(/level(\d+)/);
                  if (match) {
                    const lvl = match[1];
                    idField = `level${lvl}_id`;
                    nameField = `level${lvl}_name`;
                    label = `Level ${lvl}`;
                  } else if (col.endsWith("_id")) {
                    idField = col;
                    nameField = col.replace("_id", "");
                    label = col
                      .replace("_id", "")
                      .replace(/_/g, " ")
                      .toUpperCase();
                  } else {
                    return null;
                  }

                  return (
                    <tr key={`${rowId}-${idx}`} className="border-t">
                      <td className="p-3">{label}</td>

                      <td className="p-3">
                        <input
                          value={
                            editedRows[rowId]?.[idField] ??
                            row[idField] ??
                            ""
                          }
                          onChange={e =>
                            handleChange(
                              rowId,
                              row,
                              idField,
                              e.target.value
                            )
                          }
                          className="border rounded px-2 py-1 w-24"
                        />
                      </td>

                      <td className="p-3">
                        <input
                          value={
                            editedRows[rowId]?.[nameField] ??
                            row[nameField] ??
                            ""
                          }
                          onChange={e =>
                            handleChange(
                              rowId,
                              row,
                              nameField,
                              e.target.value
                            )
                          }
                          className="border rounded px-2 py-1 w-40"
                        />
                      </td>

                      <td className="p-3 text-red-600 font-medium">
                        <div className="text-xs">{issue.issue_type}</div>
                        <div className="text-xs text-gray-500">
                          {issue.message || "Hierarchy mismatch"}
                        </div>
                      </td>

                      <td className="p-3">
                        {savedRows[saveKey] ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                            Saved ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSave(row, col)}
                            disabled={savingRow === saveKey}
                            className="px-3 py-1 bg-[#032B4E] text-white rounded"
                          >
                            {savingRow === saveKey ? "Saving..." : "Save"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------------- SALES ISSUE TABLE (OLD) ---------------- */

function SalesIssueSection({ rows, setRows, issueType }) {
  const [savingRow, setSavingRow] = useState(null);

  const handleSave = async (rowObj) => {
    const rowId = rowObj.__row_id;

    try {
      setSavingRow(rowId);

      await axios.post(`${REACT_APP_API_BASE_URL}/qc/apply-rows`, {
        data_upload_id: fresh_upload_id,
        file_type: "sales",
        rows: [rowObj]
      });

      setRows(prev => prev.filter(r => r.__row_id !== rowId));
    } catch {
      alert("Failed to apply fix");
    } finally {
      setSavingRow(null);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-gray-50">
      <table className="w-full text-sm">
        <thead className="bg-[#032B4E] text-white">
          <tr>
            <th className="p-3">SKU</th>
            <th className="p-3">Date</th>
            <th className="p-3">Sales</th>
            <th className="p-3">Issue</th>
            <th className="p-3">Fix</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(item => {
            const row = item.row;
            const issue = item.issues.find(
              i => i.issue_type === issueType
            );

            return (
              <tr key={row.__row_id} className="border-t">
                <td className="p-3">{row.sku_level6}</td>
                <td className="p-3">
                  {new Date(row.date).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    defaultValue={row.sales}
                    onChange={e =>
                      (row.sales = Number(e.target.value))
                    }
                    className="border px-2 py-1 rounded w-28"
                  />
                </td>
                <td className="p-3 text-red-600 text-xs">
                  {issue?.message}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleSave(row)}
                    disabled={savingRow === row.__row_id}
                    className="px-3 py-1 bg-[#032B4E] text-white rounded"
                  >
                    {savingRow === row.__row_id
                      ? "Saving..."
                      : "Save"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function QCMetric({ title, value, status }) {
  const styles = {
    warn: "bg-yellow-100 text-yellow-700",
    fail: "bg-red-100 text-red-700"
  };

  return (
    <div className="border rounded-lg p-4 text-sm">
      <p className="text-gray-500">{title}</p>
      <p className={`inline-block mt-2 px-3 py-1 rounded ${styles[status]}`}>
        {value}
      </p>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center py-6">
      <div className="animate-spin h-6 w-6 border-4 border-[#032B4E] border-t-transparent rounded-full" />
      <span className="ml-3 text-sm text-gray-600">Processing…</span>
    </div>
  );
}
