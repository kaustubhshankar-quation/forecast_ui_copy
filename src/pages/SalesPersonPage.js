import React, { useState, useEffect } from 'react';
import { getAllSalesPersons } from '../services/ApiWorkflow';

const styles = {
  wrapper: {
    background: "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    padding: '60px 0',
  },
  container: {
    width: '95%',
    maxWidth: '1600px',
    backgroundColor: '#fbfcf7ff',
    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
    border: '1px solid #475C7E',
    padding: '50px',
  },
};

export default function SalesPersonPage() {
  const [salesPersonsList, setSalesPersonsList] = useState([]);
  const [skuMap, setSkuMap] = useState({});
  const [form, setForm] = useState({ sp_name: '', sp_email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSalesPersons();
  }, []);

  const fetchSalesPersons = async () => {
    const data = await getAllSalesPersons();
    setSalesPersonsList(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSalesPerson = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/add_sp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (result.status === 'success') {
        alert('Salesperson added successfully!');
        setForm({ sp_name: '', sp_email: '' });
        fetchSalesPersons();
      } else {
        alert(result.message || 'Failed to add salesperson.');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding salesperson.');
    } finally {
      setLoading(false);
    }
  };

  const handleSKUClick = async (event, sp_id) => {
    event.preventDefault();
    event.stopPropagation();

    const row = event.currentTarget.closest('tr');
    const foldRow = row.nextElementSibling;
    const allRows = document.querySelectorAll('tr:not(.fold-row)');
    const allFoldRows = document.querySelectorAll('.fold-row');

    if (!skuMap[sp_id]) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/get_sp_sku_mapping?sp_id=${sp_id}`);
        const result = await response.json();
        if (result.Status === 'success') {
          setSkuMap((prev) => ({
            ...prev,
            [sp_id]: result.data?.filter((el) => el.sku_level1 !== null),
          }));
        }
      } catch (error) {
        console.error('Error fetching SKU mapping:', error);
      }
    }

    if (foldRow.style.display === 'table-row') {
      foldRow.style.display = 'none';
      row.classList.remove('bg-blue-100');
    } else {
      allFoldRows.forEach((el) => (el.style.display = 'none'));
      allRows.forEach((el) => el.classList.remove('bg-blue-100'));
      foldRow.style.display = 'table-row';
      row.classList.add('bg-blue-100');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-xl p-6 border-l-8 border-[#032B4E] mb-10">
          <h2 className="mb-2" style={{ fontSize: '35px', fontWeight: 600, color: '#0F1116', fontFamily: 'Poppins, sans-serif' }}>
            Sales Team Member List
          </h2>
          <p className="text-gray-600" style={{ fontSize: '18px', fontWeight: 400, fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>
            View and manage all salespersons and their assigned SKUs efficiently.
          </p>
        </div>

        {/* Add Salesperson Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10 border-2 border-[#1F4280]">
          <div className="bg-[#032B4E] px-6 py-4 text-white" style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
            Add New Salesperson
          </div>
          <form
            onSubmit={handleAddSalesPerson}
            className="p-6 flex flex-wrap gap-6 justify-between items-end"
          >
            <div className="flex-1 min-w-[250px]">
              <label className="block text-gray-700 mb-2" style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>Name</label>
              <input
                type="text"
                name="sp_name"
                placeholder="Enter salesperson name"
                value={form.sp_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032B4E]"
                style={{ fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label className="block text-gray-700 mb-2" style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>Email</label>
              <input
                type="email"
                name="sp_email"
                placeholder="Enter email address"
                value={form.sp_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032B4E]"
                style={{ fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg shadow-md transition-all ${loading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-[#b8842f] text-white hover:bg-[#a67d2e] transform hover:-translate-y-1'
                }`}
              style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
            >
              {loading ? 'Adding...' : '➕ Add Salesperson'}
            </button>
          </form>
        </div>

        {/* Sales Persons Table */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-[#1F4280]">
          {/* Header Title */}
          <div className="px-6 py-4 text-[#0F1116] text-center border-b-4 border-[#032B4E]/20" style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
            Sales Team Directory
          </div>

          {/* Table */}
          <table className="w-full border-collapse" style={{ borderSpacing: 0 }}>
            <thead className="bg-[#032B4E] text-white" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
              <tr>
                <th className="px-6 py-4 font-bold text-center" style={{ fontSize: '18px', borderRight: '2px solid rgba(255, 255, 255, 0.1)' }}>
                  NAME
                </th>
                <th className="px-6 py-4 font-bold text-center" style={{ fontSize: '18px', borderRight: '2px solid rgba(255, 255, 255, 0.1)' }}>
                  EMAIL
                </th>
                <th className="px-6 py-4 font-bold text-center" style={{ fontSize: '18px' }}>
                  ASSIGNED SKUS
                </th>
              </tr>
            </thead>

            <tbody className="bg-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
              {salesPersonsList.length > 0 ? (
                salesPersonsList.map((elem, index) => (
                  <React.Fragment key={elem.sp_id}>
                    <tr
                      className="hover:bg-gray-50 transition-colors duration-200"
                      style={{ borderBottom: index < salesPersonsList.length - 1 ? '1px solid #e0e0e0' : 'none' }}
                    >
                      <td
                        className="px-6 py-4"
                        style={{ borderRight: "1px solid #e0e0e0" }}
                      >
                        <div
                          className="flex items-center"
                          style={{
                            justifyContent: "flex-start",
                            gap: "12px",
                          }}
                        >
                          <div
                            className="bg-gradient-to-br from-[#032B4E] to-[#1F4280] text-white flex items-center justify-center rounded-full shadow-md"
                            style={{
                              width: 40,
                              height: 40,
                              fontSize: 16,
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            {elem.sp_name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              fontFamily: "Inter, sans-serif",
                              color: "#1F2937",
                              lineHeight: 1,          // 👈 keeps vertical center
                            }}
                          >
                            {elem.sp_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', borderRight: '1px solid #e0e0e0' }}>
                        {elem.sp_email}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={(e) => handleSKUClick(e, elem.sp_id)}
                          className="bg-[#032B4E] text-white rounded-lg hover:bg-[#021a30] transition-all duration-300 shadow-lg hover:shadow-xl"
                          style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif', padding: '10px 20px' }}
                        >
                          View SKUs
                        </button>
                      </td>
                    </tr>

                    {/* Folded Row */}
                    <tr className="fold-row" style={{ display: 'none' }}>
                      <td colSpan="3" className="bg-blue-50 px-4 py-2">
                        <div className="bg-white p-3 rounded-lg shadow-inner">
                          <h4 className="text-[#032B4E] mb-3 text-center" style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                            SKU Assignments for {elem.sp_name}
                          </h4>
                          {skuMap[elem.sp_id]?.length > 0 ? (
                            <table className="w-full border">
                              <thead>
                                <tr className="bg-gray-100 text-gray-800" style={{ fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                                  <th className="px-3 py-2 border-r border-gray-300" style={{ fontSize: '14px' }}>🌍 Geography</th>
                                  <th className="px-3 py-2" style={{ fontSize: '14px' }}>🏷️ SKU Brand/Category</th>
                                </tr>
                              </thead>
                              <tbody style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                                {skuMap[elem.sp_id].map((item, skuIndex) => (
                                  <tr
                                    key={skuIndex}
                                    className={`${skuIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                      }`}
                                  >
                                    <td className="px-3 py-2 border-r border-gray-200">
                                      {item.geo_location}
                                    </td>
                                    <td className="px-3 py-2">
                                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>
                                        {item.sku_level1} \ {item.sku_level2}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-gray-600 text-center py-2" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                              📭 No SKU assignments found
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-600" style={{ fontSize: '16px', fontFamily: 'Inter, sans-serif', padding: '40px' }}>
                    No salespersons found. Add your first salesperson above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
