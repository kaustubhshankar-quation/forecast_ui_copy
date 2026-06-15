// import React, { useState, useEffect, useContext } from "react";
// import { useFormContext } from "../createworkflow/FormContext";
// import MenuContext from "../createworkflow/MenuContext";
// import { ErrorBoundary } from "../common/ErrorBoundary";
// import { ArrowRight, PlusCircle, UploadCloud, CheckCircle, AlertCircle } from "lucide-react";
// import axios from 'axios'; // ✅ Added axios import
// import { displayMessage } from "../../Utils/helper";
// import Papa from 'papaparse';
// import * as XLSX from 'xlsx';

// const { REACT_APP_API_BASE_URL } = process.env;
// export default function Stage5() {
//   const { formData, updateFormData } = useFormContext();
//   const { setActiveTab } = useContext(MenuContext);

//   const [events, setEvents] = useState([]);
//   const [eventName, setEventName] = useState("");
//   const [loadingEvents, setLoadingEvents] = useState(true);
//   const [eventType, setEventType] = useState("Compulsory");
//   const [customEventType, setCustomEventType] = useState("");

//   // ✅ Month toggles state (0 = inactive, 1 = active)
//   const [monthToggles, setMonthToggles] = useState({
//     January: 0, February: 0, March: 0, April: 0, May: 0, June: 0,
//     July: 0, August: 0, September: 0, October: 0, November: 0, December: 0,
//   });

//   // ✅ Upload states
//   const [uploadFile, setUploadFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState(null);
//   const [uploadStatusMessage, setUploadStatusMessage] = useState("");

//   // ✅ Fetch events on component mount
//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   // ✅ Axios call to fetch events from backend
//   const fetchEvents = async () => {
//     try {
//       setLoadingEvents(true);
//       const response = await axios.get(`${REACT_APP_API_BASE_URL}/exog_event_list`);

//       if (response.data.status === 200) {
//         setEvents(response.data.events);
//         updateFormData("stage5", {
//           ...formData.stage5,
//           events: response.data.events
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       displayMessage("danger", "Failed to load events. Please refresh.");
//     } finally {
//       setLoadingEvents(false);
//     }
//   };

//   useEffect(() => {
//     updateFormData("stage5", { ...formData.stage5, events });
//   }, [events]);

//   // ✅ Reset form function
//   const resetForm = () => {
//     setEventName("");
//     setCustomEventType("");
//     setEventType("Compulsory");
//     setMonthToggles({
//       January: 0, February: 0, March: 0, April: 0, May: 0, June: 0,
//       July: 0, August: 0, September: 0, October: 0, November: 0, December: 0,
//     });
//   };

//   // ✅ Toggle month handler
//   const handleMonthToggle = (month) => {
//     setMonthToggles((prev) => ({
//       ...prev,
//       [month]: prev[month] === 0 ? 1 : 0,
//     }));
//   };

//   // ✅ Add Single Event with axios & refresh list
//   const handleAddEvent = async () => {
//     if (!eventName.trim()) {
//       displayMessage("danger", "Please enter an event name");
//       return;
//     }

//     if (eventType === "Custom" && !customEventType.trim()) {
//       displayMessage("danger", "Please enter a custom event type");
//       return;
//     }

//     const finalEventType = eventType === "Custom" ? customEventType.trim() : eventType;

//     const payload = {
//       eventName: eventName.trim(),
//       eventType: finalEventType,
//       monthToggles,
//       range: "monthly"
//     };

//     try {
//       await axios.post(`${REACT_APP_API_BASE_URL}/exog_event_addition`, payload);

//       // ✅ Refresh events list after successful add
//       await fetchEvents();

//       // ✅ SUCCESS: Show message & reset form
//       displayMessage("success", "Event added successfully!");
//       resetForm();
//     } catch (error) {
//       console.error('Error adding event:', error);
//       const errorMessage = error.response?.data?.message || "Failed to add event!";
//       displayMessage("danger", errorMessage);
//     }
//   };


//   const downloadCSVTemplate = () => {
//     // Correct public path for Vite/React
//     const csvFilePath = '/sample_files/exog_data.csv'; // Note the LEADING SLASH

//     try {
//       const link = document.createElement('a');
//       link.href = csvFilePath;
//       link.download = 'exog_data_template.csv';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       displayMessage("success", "CSV template downloaded successfully!");
//     } catch (error) {
//       console.error('Download error:', error);
//       displayMessage("danger", "Failed to download CSV template.");
//     }
//   };

//   // ✅ Handle File Upload - FIXED
//  // ✅ Handle File Upload - FIXED for multiple uploads
// const handleFileUpload = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
//   if (!validTypes.includes(file.type)) {
//     displayMessage("danger", "Please upload CSV file only");
//     // ✅ Clear input even on validation error
//     e.target.value = '';
//     return;
//   }

//   setIsUploading(true);
//   setUploadStatus(null);
//   setUploadStatusMessage("");

//   try {
//     const processedEvents = await parseBulkEventCSV(file);

//     if (processedEvents.length === 0) {
//       throw new Error("No valid events found in file");
//     }

//     console.log("✅ Parsed Events:", processedEvents);

//     // ✅ Send to backend
//     const response = await axios.post(`${REACT_APP_API_BASE_URL}/api/events/bulk-upload`, {
//       events: processedEvents,
//       filename: file.name
//     }, { headers: { 'Content-Type': 'application/json' } });

//     // ✅ Success
//     setEvents(prev => [...prev, ...response.data.events]);
//     setUploadStatus('success');
//     setUploadStatusMessage(`✅ Uploaded ${response.data.events.length} events`);
//     displayMessage("success", `Uploaded ${response.data.events.length} events!`);

//     updateFormData("stage5", {
//       ...formData.stage5,
//       uploadedFile: file.name,
//       bulkEvents: response.data.events
//     });

//   } catch (error) {
//     console.error('Upload error:', error);
//     const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
//     setUploadStatus('error');
//     setUploadStatusMessage(`❌ ${errorMessage}`);
//     displayMessage("danger", errorMessage);
//   } finally {
//     setIsUploading(false);
//     // ✅ FORCE CLEAR ALL file inputs (works for both regular & debug)
//     setTimeout(() => {
//       const allFileInputs = document.querySelectorAll('input[type="file"]');
//       allFileInputs.forEach(input => input.value = '');
//     }, 100);
//   }
// };



//   // ✅ Handle File Upload - UPDATED with axios
//   const parseBulkEventCSV = (file) => {
//     return new Promise((resolve, reject) => {
//       Papa.parse(file, {
//         header: true,           // row 1 = headers
//         skipEmptyLines: true,
//         complete: (results) => {
//           try {
//             const rows = results.data;   // array of objects
//             if (!rows.length) return resolve([]);

//             // headers are available here too
//             const headers = results.meta.fields;   // ["Month","FestivalsInMonth","dashera","christmas",...]
//             const eventNames = headers.slice(2);   // skip Month, FestivalsInMonth

//             const monthMapping = {
//               jan: 'January', feb: 'February', mar: 'March', apr: 'April',
//               may: 'May', jun: 'June', jul: 'July', aug: 'August',
//               augt: 'August',   // just in case typo
//               sep: 'September', sept: 'September',
//               oct: 'October', nov: 'November', dec: 'December'
//             };

//             const events = [];

//             eventNames.forEach((eventName) => {
//               const monthToggles = {
//                 January: 0, February: 0, March: 0, April: 0, May: 0, June: 0,
//                 July: 0, August: 0, September: 0, October: 0, November: 0, December: 0
//               };

//               rows.forEach((row) => {
//                 const rawMonth = (row.Month || '').trim().toLowerCase();   // "jan"
//                 const fullMonth = monthMapping[rawMonth];
//                 if (!fullMonth) return;

//                 const val = (row[eventName] ?? '').toString().trim();
//                 if (val === '1') monthToggles[fullMonth] = 1;
//               });

//               if (Object.values(monthToggles).some((v) => v === 1)) {
//                 events.push({
//                   eventName: eventName.trim(),
//                   eventType: 'Compulsory',
//                   monthToggles,
//                   range: 'monthly'
//                 });
//               }
//             });

//             console.log('✅ Created events:', events);
//             resolve(events);
//           } catch (err) {
//             reject(err);
//           }
//         },
//         error: (err) => reject(err)
//       });
//     });
//   };




//   const handleNext = () => setActiveTab("Stage6");

//   const handleBack = () => setActiveTab("Stage4");

//   // ✅ Split months into 2 groups of 6
//   const months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December",
//   ];
//   const firstHalfMonths = months.slice(0, 6);
//   const secondHalfMonths = months.slice(6, 12);

//   return (
//     <ErrorBoundary>
//       <div style={styles.wrapper}>
//         <div style={styles.card}>
//           {/* Progress Indicator */}
//           <div className="flex items-center justify-start mb-8">
//             {[1, 2, 3, 4, 5, 6, 7].map((step, index) => (
//               <React.Fragment key={step}>
//                 <div
//                   className={`flex items-center justify-center rounded-full ${step === 5 ? "bg-[#032B4E] text-white" : "bg-gray-200 text-gray-600"
//                     }`}
//                   style={{
//                     width: "36px", height: "36px", fontFamily: "'Inter', sans-serif",
//                     fontWeight: 600, fontSize: "14px",
//                     border: step === 5 ? "2px solid #032B4E" : "2px solid #d1d5db",
//                   }}
//                 >
//                   {step}
//                 </div>
//                 {index < 6 && (
//                   <div
//                     className={`h-0.5 ${step < 5 ? "bg-[#032B4E]" : "bg-gray-300"}`}
//                     style={{ width: "40px" }}
//                   />
//                 )}
//               </React.Fragment>
//             ))}
//           </div>

//           <h2
//             className="text-[30px] text-[#0F1116] text-left mb-8"
//             style={{ fontFamily: "'Poppins', serif", fontWeight: 600 }}
//           >
//             Step 5: Event & Seasonality Layer
//           </h2>

//           {/* Layout */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//             {/* Add Event Form */}
//             <div
//               style={{ background: "#ffffff" }}
//               className="bg-gradient-to-br from-[#FFFFFF] to-[#F8FAFF] border-2 border-[#475C7E] rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] p-8 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1.5"
//             >
//               <h3
//                 className="text-[20px] mb-6"
//                 style={{ fontFamily: "'Poppins', serif", fontWeight: 600, color: "#0F1116" }}
//               >
//                 Add Event
//               </h3>

//               <div className="space-y-5">
//                 {/* Event Name */}
//                 <div>
//                   <label className="text-[14px] font-medium text-gray-700 block mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
//                     Event Name *
//                   </label>
//                   <input
//                     type="text"
//                     value={eventName}
//                     onChange={(e) => setEventName(e.target.value)}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032B4E] focus:border-[#032B4E] outline-none text-[14px] shadow-sm"
//                     placeholder="Enter event name"
//                     style={{ fontFamily: "Inter, sans-serif" }}
//                   />
//                 </div>

//                 {/* Event Type */}
//                 <div>
//                   <label className="text-[14px] font-medium text-gray-700 block mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
//                     Type *
//                   </label>
//                   <select
//                     value={eventType}
//                     onChange={(e) => setEventType(e.target.value)}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032B4E] focus:border-[#032B4E] outline-none text-[14px] shadow-sm"
//                     style={{ fontFamily: "Inter, sans-serif" }}
//                   >
//                     <option value="Compulsory">Compulsory</option>
//                     <option value="Custom">Custom</option>
//                   </select>
//                   {eventType === "Custom" && (
//                     <div className="mt-3">
//                       <input
//                         type="text"
//                         value={customEventType}
//                         onChange={(e) => setCustomEventType(e.target.value)}
//                         placeholder="Enter custom event type"
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032B4E] focus:border-[#032B4E] outline-none text-[14px] shadow-sm"
//                         style={{ fontFamily: "Inter, sans-serif" }}
//                       />
//                     </div>
//                   )}
//                 </div>

//                 {/* Month Toggles - 2 Column Table */}
//                 <div>
//                   <label className="text-[14px] font-medium text-gray-700 mb-3 block" style={{ fontFamily: "Inter, sans-serif" }}>
//                     Select Active Months
//                   </label>
//                   <div className="grid grid-cols-2 gap-4">
//                     {/* Jan-Jun */}
//                     <div className="bg-white border-2 border-[#475C7E] rounded-xl shadow-lg overflow-hidden">
//                       <table className="w-full">
//                         <thead className="bg-[#032B4E] text-white">
//                           <tr>
//                             <th className="py-2 px-3 text-left text-[12px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Month</th>
//                             <th className="py-2 px-3 text-center text-[12px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Active</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {firstHalfMonths.map((month, idx) => (
//                             <tr key={month} className={`border-b border-gray-200 hover:bg-[#f5fbff] transition-all duration-200 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
//                               <td className="py-2 px-3 text-[12px] text-gray-800 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
//                                 {month}
//                               </td>
//                               <td className="py-2 px-3 text-center">
//                                 <button
//                                   onClick={() => handleMonthToggle(month)}
//                                   className={`w-12 h-6 rounded-full transition-all duration-300 shadow-md relative mx-auto ${monthToggles[month] === 1 ? "bg-[#032B4E]" : "bg-gray-300"
//                                     }`}
//                                 >
//                                   <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 block ${monthToggles[month] === 1 ? "translate-x-6" : "translate-x-0"
//                                     }`}></span>
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Jul-Dec */}
//                     <div className="bg-white border-2 border-[#475C7E] rounded-xl shadow-lg overflow-hidden">
//                       <table className="w-full">
//                         <thead className="bg-[#032B4E] text-white">
//                           <tr>
//                             <th className="py-2 px-3 text-left text-[12px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Month</th>
//                             <th className="py-2 px-3 text-center text-[12px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Active</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {secondHalfMonths.map((month, idx) => (
//                             <tr key={month} className={`border-b border-gray-200 hover:bg-[#f5fbff] transition-all duration-200 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
//                               <td className="py-2 px-3 text-[12px] text-gray-800 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
//                                 {month}
//                               </td>
//                               <td className="py-2 px-3 text-center">
//                                 <button
//                                   onClick={() => handleMonthToggle(month)}
//                                   className={`w-12 h-6 rounded-full transition-all duration-300 shadow-md relative mx-auto ${monthToggles[month] === 1 ? "bg-[#032B4E]" : "bg-gray-300"
//                                     }`}
//                                 >
//                                   <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 block ${monthToggles[month] === 1 ? "translate-x-6" : "translate-x-0"
//                                     }`}></span>
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Add Event Button */}
//                 <button
//                   onClick={handleAddEvent}
//                   disabled={loadingEvents}
//                   className="w-full bg-[#032B4E] hover:bg-[#021a30] text-white py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-[14px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                   style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
//                 >
//                   <PlusCircle size={20} />
//                   Add Event
//                 </button>
//               </div>
//             </div>

//             {/* Events List & Upload */}
//             <div
//               style={{ background: "#ffffff" }}
//               className="bg-gradient-to-br from-[#FFFFFF] to-[#F8FAFF] border-2 border-[#475C7E] rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] p-8 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 flex flex-col"
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <h3
//                   className="text-[20px]"
//                   style={{ fontFamily: "'Poppins', serif", fontWeight: 600, color: "#0F1116" }}
//                 >
//                   Events ({events.length})
//                 </h3>
//                 <span
//                   className="text-[14px] bg-green-100 text-green-800 px-3 py-1 rounded-md shadow-sm"
//                   style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
//                 >
//                   Draft Saved
//                 </span>
//               </div>

//               {/* Events Table with Loading State */}
//               <div className="mb-5 bg-white border-2 border-[#475C7E] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,128,0,0.25)] hover:scale-[1.01]">
//                 {loadingEvents ? (
//                   <div className="p-8 text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#032B4E] mx-auto mb-4"></div>
//                     <p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Loading events...</p>
//                   </div>
//                 ) : events.length === 0 ? (
//                   <div className="p-12 text-center">
//                     <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                     <p className="text-gray-500 text-lg" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>No events found</p>
//                     <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>Add your first event or check backend connection</p>
//                   </div>
//                 ) : (
//                   <table className="w-full text-left">
//                     <thead className="bg-[#032B4E] text-white sticky top-0 z-10">
//                       <tr>
//                         <th className="py-3 px-4 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Event Name</th>
//                         <th className="py-3 px-4 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Type</th>
//                         <th className="py-3 px-4 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Range</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {events.map((event, idx) => (
//                         <tr key={idx} className="border-b border-[#d8f0e4] hover:bg-[#f5fbff] transition-all duration-200">
//                           <td className="py-4 px-6 font-semibold text-[14px]" style={{ fontFamily: "Inter, sans-serif", color: "#0F1116" }}>
//                             {event.name}
//                           </td>
//                           <td className="py-4 px-6 text-gray-700 text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
//                             {event.type}
//                           </td>
//                           <td className="py-4 px-6 text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
//                             <span className={`px-3 py-1 text-sm font-medium rounded-full ${event.range === "Weekly"
//                               ? "bg-[#1F4280] bg-opacity-20 text-[#1F4280]"
//                               : event.range === "None"
//                                 ? "bg-gray-100 text-gray-600"
//                                 : event.range === "All Months"
//                                   ? "bg-green-100 text-green-700"
//                                   : "bg-purple-100 text-purple-700"
//                               }`}>
//                               {event.range}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}
//               </div>

//               {/* Upload Section */}
//               {/* Upload Section */}
//               <div className="flex-1 border border-dashed border-[#1F4280] rounded-xl p-8 text-center bg-[#F9FBFF] hover:border-[#163464] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-center">
//                 <UploadCloud className="w-12 h-12 text-[#1F4280] mx-auto mb-3 animate-pulse" />
//                 <p className="mb-1 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "#0F1116" }}>
//                   Drag and drop or Upload
//                 </p>
//                 <p className="text-[14px] text-gray-500 mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
//                   CSV to add events in bulk with seasonality values included
//                 </p>

//                 <label className="cursor-pointer block mb-4">
//                   <span className="text-[#b8842f] hover:underline text-[14px] block mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
//                     Download CSV Template
//                   </span>
//                   <input
//                     type="file"
//                     className="hidden"
//                     onClick={downloadCSVTemplate}
//                     accept=".csv"
//                     disabled={isUploading}
//                   />
//                 </label>

//                 <label className="cursor-pointer">
//                   <span className="text-[#b8842f] hover:underline text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
//                     Upload Bulk Data
//                   </span>
//                   <input
//                     type="file"
//                     className="hidden"
//                     onChange={handleFileUpload}  // ✅ FIXED: Call handleFileUpload
//                     accept=".csv"
//                     disabled={isUploading}
//                   />
//                 </label>
              
//                 {uploadStatus && (
//                   <div className={`mt-4 p-3 rounded-lg ${uploadStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
//                     <p className="text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
//                       {uploadStatusMessage}
//                     </p>
//                   </div>
//                 )}
//               </div>

//             </div>
//           </div>

//           {/* Footer Navigation */}
//           <div className="mt-12 flex justify-between items-center">
//             <button
//               onClick={handleBack}
//               className="px-8 py-3 bg-[#b8842f] hover:bg-[#a67d2e] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-[14px]"
//               style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
//             >
//               ← Back
//             </button>
//             <button
//               onClick={handleNext}
//               disabled={loadingEvents}
//               className="px-8 py-2.5 rounded-lg bg-[#b8842f] text-white hover:bg-[#a67d2e] shadow-lg hover:shadow-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{
//                 fontFamily: "'Inter', sans-serif",
//                 fontSize: "14px",
//                 fontWeight: 600,
//               }}
//             >
//               Next →
//             </button>
//           </div>
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// }

// const styles = {
//   wrapper: {
//     width: "100%",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
//     padding: "60px 20px",
//     minHeight: "100vh",
//     boxSizing: "border-box",
//   },
//   card: {
//     width: "100%",
//     maxWidth: 1500,
//     background: "#fbfcf7ff",
//     padding: "40px 40px 60px",
//     boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
//     border: "1px solid #D9E1EC",
//     borderRadius: "24px",
//     overflow: "hidden",
//   },
// };



import React, { useState, useEffect, useContext } from "react";
import { useFormContext } from "../createworkflow/FormContext";
import MenuContext from "../createworkflow/MenuContext";
import { ErrorBoundary } from "../common/ErrorBoundary";
import { ArrowRight, PlusCircle, UploadCloud, CheckCircle, AlertCircle } from "lucide-react";
import axios from 'axios'; // ✅ Added axios import
import { displayMessage } from "../../Utils/helper";
import Papa from 'papaparse';

const { REACT_APP_API_BASE_URL } = process.env;
export default function Stage5() {
  const { formData, updateFormData } = useFormContext();
  const { setActiveTab } = useContext(MenuContext);

  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  // const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventType, setEventType] = useState("Compulsory");
  const [customEventType, setCustomEventType] = useState("");

  // ✅ Month toggles state (0 = inactive, 1 = active)
  const [monthToggles, setMonthToggles] = useState({
    January: 0, February: 0, March: 0, April: 0, May: 0, June: 0,
    July: 0, August: 0, September: 0, October: 0, November: 0, December: 0,
  });

  // ✅ Upload states
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadStatusMessage, setUploadStatusMessage] = useState("");

  // ✅ Fetch events on component mount
  useEffect(() => {
    // fetchEvents();
  }, []);

  // ✅ Axios call to fetch events from backend
  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const response = await axios.get(`${REACT_APP_API_BASE_URL}/exog_event_list`);

      if (response.data.status === 200) {
        setEvents(response.data.events);
        updateFormData("stage5", {
          ...formData.stage5,
          events: response.data.events
        });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      displayMessage("danger", "Failed to load events. Please refresh.");
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    updateFormData("stage5", { ...formData.stage5, events });
  }, [events]);

  // ✅ Reset form function
  const resetForm = () => {
    setEventName("");
    setCustomEventType("");
    setEventType("Compulsory");
    setMonthToggles({
      January: 0, February: 0, March: 0, April: 0, May: 0, June: 0,
      July: 0, August: 0, September: 0, October: 0, November: 0, December: 0,
    });
  };

  // ✅ Toggle month handler
  const handleMonthToggle = (month) => {
    setMonthToggles((prev) => ({
      ...prev,
      [month]: prev[month] === 0 ? 1 : 0,
    }));
  };

  // ✅ Add Single Event with axios & refresh list
  const handleAddEvent = async () => {
    if (!eventName.trim()) {
      displayMessage("danger", "Please enter an event name");
      return;
    }

    if (eventType === "Custom" && !customEventType.trim()) {
      displayMessage("danger", "Please enter a custom event type");
      return;
    }

    const finalEventType = eventType === "Custom" ? customEventType.trim() : eventType;

    const payload = {
      eventName: eventName.trim(),
      eventType: finalEventType,
      monthToggles,
      range: "monthly"
    };

    try {
      await axios.post(`${REACT_APP_API_BASE_URL}/exog_event_addition`, payload);

      // ✅ Refresh events list after successful add
      await fetchEvents();

      // ✅ SUCCESS: Show message & reset form
      displayMessage("success", "Event added successfully!");
      resetForm();
    } catch (error) {
      console.error('Error adding event:', error);
      const errorMessage = error.response?.data?.message || "Failed to add event!";
      displayMessage("danger", errorMessage);
    }
  };


  const downloadCSVTemplate = () => {
    // Correct public path for Vite/React
    const csvFilePath = '/sample_files/exog_data.csv'; // Note the LEADING SLASH

    try {
      const link = document.createElement('a');
      link.href = csvFilePath;
      link.download = 'exog_data_template.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      displayMessage("success", "CSV template downloaded successfully!");
    } catch (error) {
      console.error('Download error:', error);
      displayMessage("danger", "Failed to download CSV template.");
    }
  };

  // ✅ Handle File Upload - FIXED
 // ✅ Handle File Upload - FIXED for multiple uploads
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  if (!validTypes.includes(file.type)) {
    displayMessage("danger", "Please upload CSV file only");
    // ✅ Clear input even on validation error
    e.target.value = '';
    return;
  }

  setIsUploading(true);
  setUploadStatus(null);
  setUploadStatusMessage("");

  try {
    const processedEvents = await parseBulkEventCSV(file);

    if (processedEvents.length === 0) {
      throw new Error("No valid events found in file");
    }

    console.log("✅ Parsed Events:", processedEvents);

    // ✅ Send to backend
    const response = await axios.post(`${REACT_APP_API_BASE_URL}/api/events/bulk-upload`, {
      events: processedEvents,
      filename: file.name
    }, { headers: { 'Content-Type': 'application/json' } });

    // ✅ Success
    setEvents(prev => [...prev, ...response.data.events]);
    setUploadStatus('success');
    setUploadStatusMessage(`✅ Uploaded ${response.data.events.length} events`);
    displayMessage("success", `Uploaded ${response.data.events.length} events!`);

    updateFormData("stage5", {
      ...formData.stage5,
      uploadedFile: file.name,
      bulkEvents: response.data.events
    });

  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
    setUploadStatus('error');
    setUploadStatusMessage(`❌ ${errorMessage}`);
    displayMessage("danger", errorMessage);
  } finally {
    setIsUploading(false);
    // ✅ FORCE CLEAR ALL file inputs (works for both regular & debug)
    setTimeout(() => {
      const allFileInputs = document.querySelectorAll('input[type="file"]');
      allFileInputs.forEach(input => input.value = '');
    }, 100);
  }
};



  // ✅ Handle File Upload - UPDATED with axios
  const parseBulkEventCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,           // row 1 = headers
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const rows = results.data;   // array of objects
            if (!rows.length) return resolve([]);

            // headers are available here too
            const headers = results.meta.fields;   // ["Month","FestivalsInMonth","dashera","christmas",...]
            const eventNames = headers.slice(2);   // skip Month, FestivalsInMonth

            const monthMapping = {
              jan: 'January', feb: 'February', mar: 'March', apr: 'April',
              may: 'May', jun: 'June', jul: 'July', aug: 'August',
              augt: 'August',   // just in case typo
              sep: 'September', sept: 'September',
              oct: 'October', nov: 'November', dec: 'December'
            };

            const events = [];

            eventNames.forEach((eventName) => {
              const monthToggles = {
                January: 0, February: 0, March: 0, April: 0, May: 0, June: 0,
                July: 0, August: 0, September: 0, October: 0, November: 0, December: 0
              };

              rows.forEach((row) => {
                const rawMonth = (row.Month || '').trim().toLowerCase();   // "jan"
                const fullMonth = monthMapping[rawMonth];
                if (!fullMonth) return;

                const val = (row[eventName] ?? '').toString().trim();
                if (val === '1') monthToggles[fullMonth] = 1;
              });

              if (Object.values(monthToggles).some((v) => v === 1)) {
                events.push({
                  eventName: eventName.trim(),
                  eventType: 'Compulsory',
                  monthToggles,
                  range: 'monthly'
                });
              }
            });

            console.log('✅ Created events:', events);
            resolve(events);
          } catch (err) {
            reject(err);
          }
        },
        error: (err) => reject(err)
      });
    });
  };




  const handleNext = () => setActiveTab("Stage6");

  const handleBack = () => setActiveTab("Stage4");

  // ✅ Split months into 2 groups of 6
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const firstHalfMonths = months.slice(0, 6);
  const secondHalfMonths = months.slice(6, 12);

  return (
    <ErrorBoundary>
      <div 
      style={styles.wrapper}>
        <div style={styles.card}>
          {/* Progress Indicator */}
          <div className="flex items-center justify-start mb-8">
            {[1, 2, 3, 4, 5, 6, 7].map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center rounded-full ${step === 5 ? "bg-[#032B4E] text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  style={{
                    width: "36px", height: "36px", fontFamily: "'Inter', sans-serif",
                    fontWeight: 600, fontSize: "14px",
                    border: step === 5 ? "2px solid #032B4E" : "2px solid #d1d5db",
                  }}
                >
                  {step}
                </div>
                {index < 6 && (
                  <div
                    className={`h-0.5 ${step < 5 ? "bg-[#032B4E]" : "bg-gray-300"}`}
                    style={{ width: "40px" }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <h2
            className="text-[30px] text-[#0F1116] text-left mb-8"
            style={{ fontFamily: "'Poppins', serif", fontWeight: 600 }}
          >
            Step 5: Event & Seasonality Layer
          </h2>

          {/* Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 cursor-not-allowed">
            {/* Add Event Form */}
            <div
              style={{ background: "#ffffff" }}
              className="bg-gradient-to-br from-[#FFFFFF] to-[#F8FAFF] border-2 border-[#475C7E] rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] p-8 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1.5"
            >
              <h3
                className="text-[20px] mb-6"
                style={{ fontFamily: "'Poppins', serif", fontWeight: 600, color: "#0F1116" }}
              >
                Add Event
              </h3>

              <div className="space-y-5">
                {/* Event Name */}
                <div>
                  <label className="text-[14px] font-medium text-gray-700 block mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    Event Name *
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032B4E] focus:border-[#032B4E] outline-none text-[14px] shadow-sm"
                    placeholder="Enter event name"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>

                {/* Event Type */}
                <div>
                  <label className="text-[14px] font-medium text-gray-700 block mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    Type *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032B4E] focus:border-[#032B4E] outline-none text-[14px] shadow-sm"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <option value="Compulsory">Compulsory</option>
                    <option value="Custom">Custom</option>
                  </select>
                  {eventType === "Custom" && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={customEventType}
                        onChange={(e) => setCustomEventType(e.target.value)}
                        placeholder="Enter custom event type"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032B4E] focus:border-[#032B4E] outline-none text-[14px] shadow-sm"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                    </div>
                  )}
                </div>

                {/* Month Toggles - 2 Column Table */}
                <div>
                  <label className="text-[14px] font-medium text-gray-700 mb-3 block" style={{ fontFamily: "Inter, sans-serif" }}>
                    Select Active Months
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Jan-Jun */}
                    <div className="bg-white border-2 border-[#475C7E] rounded-xl shadow-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-[#032B4E] text-white">
                          <tr>
                            <th className="py-2 px-3 text-left text-[12px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Month</th>
                            <th className="py-2 px-3 text-center text-[12px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Active</th>
                          </tr>
                        </thead>
                        <tbody>
                          {firstHalfMonths.map((month, idx) => (
                            <tr key={month} className={`border-b border-gray-200 hover:bg-[#f5fbff] transition-all duration-200 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                              <td className="py-2 px-3 text-[12px] text-gray-800 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                                {month}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  onClick={() => handleMonthToggle(month)}
                                  className={`w-12 h-6 rounded-full transition-all duration-300 shadow-md relative mx-auto ${monthToggles[month] === 1 ? "bg-[#032B4E]" : "bg-gray-300"
                                    }`}
                                >
                                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 block ${monthToggles[month] === 1 ? "translate-x-6" : "translate-x-0"
                                    }`}></span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Jul-Dec */}
                    <div className="bg-white border-2 border-[#475C7E] rounded-xl shadow-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-[#032B4E] text-white">
                          <tr>
                            <th className="py-2 px-3 text-left text-[12px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Month</th>
                            <th className="py-2 px-3 text-center text-[12px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Active</th>
                          </tr>
                        </thead>
                        <tbody>
                          {secondHalfMonths.map((month, idx) => (
                            <tr key={month} className={`border-b border-gray-200 hover:bg-[#f5fbff] transition-all duration-200 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                              <td className="py-2 px-3 text-[12px] text-gray-800 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                                {month}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  onClick={() => handleMonthToggle(month)}
                                  className={`w-12 h-6 rounded-full transition-all duration-300 shadow-md relative mx-auto ${monthToggles[month] === 1 ? "bg-[#032B4E]" : "bg-gray-300"
                                    }`}
                                >
                                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 block ${monthToggles[month] === 1 ? "translate-x-6" : "translate-x-0"
                                    }`}></span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Add Event Button */}
                <button
                  // onClick={handleAddEvent}
                  disabled={loadingEvents}
                  className="w-full bg-[#032B4E] hover:bg-[#021a30] text-white py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-[14px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-not-allowed"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                >
                  <PlusCircle size={20} />
                  Upload Event
                </button>
              </div>
            </div>

            {/* Events List & Upload */}
            <div
              style={{ background: "#ffffff" }}
              className="bg-gradient-to-br from-[#FFFFFF] to-[#F8FAFF] border-2 border-[#475C7E] rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] p-8 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-[20px]"
                  style={{ fontFamily: "'Poppins', serif", fontWeight: 600, color: "#0F1116" }}
                >
                  Events ({events.length})
                </h3>
                <span
                  className="text-[14px] bg-green-100 text-green-800 px-3 py-1 rounded-md shadow-sm"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                >
                  Draft Saved
                </span>
              </div>

              {/* Events Table with Loading State */}
              <div className="mb-5 bg-white border-2 border-[#475C7E] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,128,0,0.25)] hover:scale-[1.01]">
                {loadingEvents ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#032B4E] mx-auto mb-4"></div>
                    <p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Loading events...</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>No events found</p>
                    <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>Add your first event or check backend connection</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-[#032B4E] text-white sticky top-0 z-10">
                      <tr>
                        <th className="py-3 px-4 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Event Name</th>
                        <th className="py-3 px-4 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Type</th>
                        <th className="py-3 px-4 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event, idx) => (
                        <tr key={idx} className="border-b border-[#d8f0e4] hover:bg-[#f5fbff] transition-all duration-200">
                          <td className="py-4 px-6 font-semibold text-[14px]" style={{ fontFamily: "Inter, sans-serif", color: "#0F1116" }}>
                            {event.name}
                          </td>
                          <td className="py-4 px-6 text-gray-700 text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
                            {event.type}
                          </td>
                          <td className="py-4 px-6 text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${event.range === "Weekly"
                              ? "bg-[#1F4280] bg-opacity-20 text-[#1F4280]"
                              : event.range === "None"
                                ? "bg-gray-100 text-gray-600"
                                : event.range === "All Months"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}>
                              {event.range}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Upload Section */}
              {/* Upload Section */}
              <div className="flex-1 border border-dashed border-[#1F4280] rounded-xl p-8 text-center bg-[#F9FBFF] hover:border-[#163464] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-center">
                <UploadCloud className="w-12 h-12 text-[#1F4280] mx-auto mb-3 animate-pulse" />
                <p className="mb-1 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "#0F1116" }}>
                  Drag and drop or Upload
                </p>
                <p className="text-[14px] text-gray-500 mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                  CSV to add events in bulk with seasonality values included
                </p>

                <label className="cursor-pointer block mb-4">
                  <span className="text-[#b8842f] hover:underline text-[14px] block mb-2 cursor-not-allowed" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                    Download CSV Template
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onClick={downloadCSVTemplate}
                    accept=".csv"
                    disabled={isUploading}
                  />
                </label>

                <label className="cursor-pointer">
                  <span className="text-[#b8842f] hover:underline text-[14px] cursor-not-allowed" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                    Upload Bulk Data
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    // onChange={handleFileUpload}  // ✅ FIXED: Call handleFileUpload
                    accept=".csv"
                    disabled={isUploading}
                  />
                </label>
              
                {uploadStatus && (
                  <div className={`mt-4 p-3 rounded-lg ${uploadStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className="text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {uploadStatusMessage}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Footer Navigation */}
          <div className="mt-12 flex justify-between items-center">
            <button
              onClick={handleBack}
              className="px-8 py-3 bg-[#b8842f] hover:bg-[#a67d2e] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-[14px]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={loadingEvents}
              className="px-8 py-2.5 rounded-lg bg-[#b8842f] text-white hover:bg-[#a67d2e] shadow-lg hover:shadow-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
              }}
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
    padding: "60px 20px",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: 1500,
    background: "#fbfcf7ff",
    padding: "40px 40px 60px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
    border: "1px solid #D9E1EC",
    borderRadius: "24px",
    overflow: "hidden",
  },
};
