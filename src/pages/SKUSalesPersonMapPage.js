import React, { useState, useEffect } from "react";
import { getProductHeirarchy, getAllSalesPersons, assignSKUsToSP } from "../services/ApiWorkflow";
import { getCookie } from "../services/DataRequestService";
import Select from "react-select";
import { displayMessage } from "../Utils/helper";

const styles = {
  wrapper: {
    background: "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "50px 0",
  },
  container: {
    width: "95%",
    maxWidth: "1600px",
    backgroundColor: "#fbfcf7ff",
    boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
    border: "1px solid #475C7E",
    padding: "50px",
    zIndex: 1,
  },
};

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "2px solid #032B4E" : "1px solid #d1d5db",
    borderRadius: "10px",
    padding: "6px",
    boxShadow: state.isFocused
      ? "0 0 0 4px rgba(3,43,78,0.2)"
      : "0 2px 6px rgba(0,0,0,0.05)",
    fontSize: "16px",
    minHeight: "45px",
    backgroundColor: "white",
    zIndex: 50,
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensures dropdown is always above
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    borderRadius: "10px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
    border: "1px solid rgba(0,0,0,0.1)",
    overflow: "hidden",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#032B4E"
      : state.isFocused
      ? "#e6f3ff"
      : "white",
    color: state.isSelected ? "white" : "#333",
    padding: "12px 14px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.2s ease",
  }),
};

export default function SKUSalesPersonMapPage() {
  const [SKUCategoryList, setSKUCategoryList] = useState([]);
  const [salesPersonOptions, setSalesPersonOptions] = useState([]);
  const [geoskuList, setGeoskuList] = useState([]);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);

  useEffect(() => {
    const init = async () => {
      let productsList = await getProductHeirarchy();
      let { level2 } = addBreadcrumbs(productsList, 2);
      setSKUCategoryList(level2);
      let _salesPersons = await getAllSalesPersons();
      if (_salesPersons !== null) {
        let _salesPersonsOptions = _salesPersons.map((el) => ({
          label: el.sp_name,
          value: el.sp_id,
        }));
        setSalesPersonOptions(_salesPersonsOptions);
      }
    };
    init();
  }, []);

  const handleChangeSalesPerson = (selected) => {
    setSelectedSalesPerson(selected.value);
  };

  const handleOnChangeCheckbox = (e) => {
    const { geo, sku } = e.target.dataset;
    const item = { geo_location: geo, sku };

    setGeoskuList((prev) => {
      const exists = prev.some(
        (i) => i.geo_location === item.geo_location && i.sku === item.sku
      );
      if (e.target.checked && !exists) return [...prev, item];
      else if (!e.target.checked && exists)
        return prev.filter(
          (i) => !(i.geo_location === item.geo_location && i.sku === item.sku)
        );
      return prev;
    });
  };

  const handleOnClickSaveMapping = async () => {
    let user_id = getCookie("sub");
    if (user_id === null) {
      displayMessage("danger", "Error", "User ID not found");
      return;
    }
    if (selectedSalesPerson === null) {
      displayMessage("danger", "Invalid Input", "Please select a Sales Person");
      return;
    }
    if (geoskuList.length === 0) {
      displayMessage("danger", "Invalid Input", "Select at least one SKU");
      return;
    }
    let result = await assignSKUsToSP(user_id, selectedSalesPerson, geoskuList);
    if (result === null)
      displayMessage("danger", "Error", "Failed to assign SKU");
    else displayMessage("success", "Success", "SKUs assigned successfully");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Header */}
        <div className="bg-white rounded-xl shadow-xl p-6 border-l-8 border-[#032B4E] mb-10">
          <h2 className="mb-2 flex items-center space-x-3" style={{ fontSize: '35px', fontWeight: 600, color: '#0F1116', fontFamily: 'Poppins, sans-serif' }}>
            <span>Sales Person - SKU Mapping</span>
          </h2>
          <p className="text-gray-600" style={{ fontSize: '18px', fontWeight: 400, fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>
            Assign SKUs to salespersons with ease.
          </p>
        </div>

        {/* Select Sales Person */}
        <div className="bg-white rounded-xl shadow-2xl overflow-visible mb-10 border-2 border-[#1F4280] relative z-50">
          <div className="bg-[#032B4E] px-8 py-6 text-white flex items-center space-x-4" style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>

            <span>Select Sales Person</span>
          </div>
          <div className="p-8 z-50 relative">
            <div className="max-w-lg">
              <label className="block text-gray-800 mb-3" style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                Choose A Salesperson <span className="text-red-500">*</span>
              </label>
              <Select
                options={salesPersonOptions}
                onChange={handleChangeSalesPerson}
                placeholder="Select a salesperson..."
                styles={customSelectStyles}
                isSearchable
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
              {selectedSalesPerson && (
                <div className="mt-5 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-md">
                  <div className="flex items-center space-x-3 text-blue-700" style={{ fontSize: '16px', fontFamily: 'Inter, sans-serif' }}>
                    <span>✅</span>
                    <span>Salesperson selected successfully</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SKU Mapping Table */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-[#1F4280]">
          <div className="bg-[#032B4E] px-8 py-6 text-white flex items-center space-x-4" style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
            <span>SKU Assignment</span>
          </div>

          <div className="p-8 overflow-x-auto">
            {SKUCategoryList && SKUCategoryList.length > 0 ? (
              <table className="w-full border-collapse" style={{ borderSpacing: 0 }}>
                <thead className="bg-[#032B4E] text-white" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                  <tr>
                    <th className="px-6 py-4 font-bold text-center" style={{ fontSize: '18px', borderRight: '2px solid rgba(255, 255, 255, 0.1)' }}>
                      SKU NAME
                    </th>
                    <th className="px-6 py-4 font-bold text-center" style={{ fontSize: '18px', borderRight: '2px solid rgba(255, 255, 255, 0.1)' }}>
                      GEOGRAPHY
                    </th>
                    <th className="px-6 py-4 font-bold text-center" style={{ fontSize: '18px' }}>
                      SELECT
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                  {SKUCategoryList.map((el, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                      style={{ borderBottom: index < SKUCategoryList.length - 1 ? '1px solid #e0e0e0' : 'none' }}
                    >
                      <td className="px-6 py-4 text-center" style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'Inter, sans-serif', color: '#1F2937', borderRight: '1px solid #e0e0e0' }}>
                        <div className="flex items-center justify-center space-x-3">
                          <span>{el.breadcrumb}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center" style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#374151', borderRight: '1px solid #e0e0e0' }}>
                        India
                      </td>

                      <td className="px-6 py-4 text-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            data-geo={"India"}
                            data-sku={el.breadcrumb}
                            checked={geoskuList.some(
                              (i) =>
                                i.geo_location === "India" &&
                                i.sku === el.breadcrumb
                            )}
                            onChange={handleOnChangeCheckbox}
                            className="sr-only"
                          />
                          <div
                            className={`relative w-9 h-9 rounded-md border-[3px] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_2px_6px_rgba(0,0,0,0.15)] ${
                              geoskuList.some(
                                (i) =>
                                  i.geo_location === "India" &&
                                  i.sku === el.breadcrumb
                              )
                                ? "bg-gradient-to-br from-[#032B4E] to-[#1F4280] border-[#032B4E] scale-110 shadow-lg ring-2 ring-blue-400"
                                : "bg-white border-gray-300 hover:border-[#032B4E] hover:shadow-lg"
                            }`}
                          >
                            {geoskuList.some(
                              (i) =>
                                i.geo_location === "India" &&
                                i.sku === el.breadcrumb
                            ) && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg
                                  className="w-5 h-5 text-white drop-shadow-md"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <div className="text-6xl mb-4">📭</div>
                <p style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                  No SKU categories available
                </p>
                <p style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>Please check your data source.</p>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleOnClickSaveMapping}
            disabled={!selectedSalesPerson || geoskuList.length === 0}
            className="px-10 py-5 rounded-xl flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-2xl text-white transform hover:-translate-y-1"
            style={{
              backgroundColor: '#b8842f',
              fontSize: '18px',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              cursor: !selectedSalesPerson || geoskuList.length === 0 ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (selectedSalesPerson && geoskuList.length > 0) {
                e.currentTarget.style.backgroundColor = '#a67d2e';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#b8842f';
            }}
          >
            <span>Save Mapping</span>
            {geoskuList.length > 0 && (
              <span className="bg-white bg-opacity-20 rounded-full px-4 py-1" style={{ fontSize: '14px' }}>
                {geoskuList.length} selected
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function addBreadcrumbs(data, numberOfLevels) {
  const levels = numberOfLevels;
  const levelMaps = {};

  for (let i = 1; i <= levels; i++) {
    const currentLevelKey = `level${i}`;
    if (data[currentLevelKey]) {
      levelMaps[currentLevelKey] = Object.fromEntries(
        data[currentLevelKey].map((level) => [
          Array.from({ length: i }, (_, idx) => level[`level${idx + 1}_id`]).join("_"),
          level.name,
        ])
      );
    }
  }

  for (let targetLevel = 1; targetLevel <= levels; targetLevel++) {
    const targetLevelKey = `level${targetLevel}`;
    if (!data[targetLevelKey]) continue;

    data[targetLevelKey] = data[targetLevelKey].map((item) => {
      const breadcrumbParts = [];
      const idParts = [];

      for (let i = 1; i <= targetLevel; i++) {
        const lookupKey = Array.from({ length: i }, (_, idx) =>
          item[`level${idx + 1}_id`]
        ).join("_");
        breadcrumbParts.push(levelMaps[`level${i}`]?.[lookupKey] || item.name);
        idParts.push(item[`level${i}_id`]);
      }

      return {
        ...item,
        breadcrumb: breadcrumbParts.join(" \\ "),
        id: idParts.join("_"),
      };
    });
  }
  return data;
}
