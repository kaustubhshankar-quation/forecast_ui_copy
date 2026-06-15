import React, { useEffect, useState } from 'react'
import Loader from '../components/common/Loader';

function SKU() {
    const [isLoading, setisLoading] = useState(false)

    // const data = [
    //     {
    //         name: "com",
    //         id: "3c116c64-e008-4cae-ad9b-3309d3e5eb7e",
    //         items: [
    //             {
    //                 name: "electrical",
    //                 id: "3c116c64-e008-4cae-ad9b-3309d3e5eb7e",
    //                 items: [{
    //                     "name": "super",
    //                     "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e"
    //                 },
    //                 {
    //                     "name": "support",
    //                     "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e"
    //                 },
    //                 ]
    //             },
    //             {
    //                 name: "mechanical",
    //                 id: "3c116c64-e008-4cae-ad9b-3309d3e5eb7e",
    //                 items: [{
    //                     "name": "focus",
    //                     "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e"
    //                 },
    //                 {
    //                     "name": "support",
    //                     "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e"
    //                 },
    //                 {
    //                     "name": "prime",
    //                     "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e",
    //                     items: [{
    //                         "name": "SWT",
    //                         "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e"
    //                     },
    //                     {
    //                         "name": "ABR",
    //                         "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e"
    //                     },
    //                     {
    //                         "name": "HRN",
    //                         "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e"

    //                     },
    //                     {
    //                         "name": "FIL",
    //                         "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e",
    //                         items: [
    //                             {
    //                                 "name": "SLB",
    //                                 "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e",
    //                             },
    //                             {
    //                                 "name": "ADR",
    //                                 "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e",
    //                             },
    //                             // ..... so on
    //                         ]
    //                     },
    //                     ]
    //                 },
    //                 ]
    //             },
    //         ]
    //     },
    //     {
    //         name: "2WH",
    //         id: "d8ba2a43-6a07-4254-9e77-70097e114e16",
    //         items: [
    //             {
    //                 name: "electrical",
    //                 id: "3c116c64-e008-4cae-ad9b-3309d3e5eb7e",
    //                 items: [{
    //                     "name": "super",
    //                     "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e"
    //                 },
    //                 {
    //                     "name": "support",
    //                     "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e"
    //                 },
    //                 ]
    //             },
    //             {
    //                 name: "mechanical",
    //                 id: "3c116c64-e008-4cae-ad9b-3309d3e5eb7e",
    //                 items: [{
    //                     "name": "focus",
    //                     "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e"
    //                 },
    //                 {
    //                     "name": "support",
    //                     "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e"
    //                 },
    //                 {
    //                     "name": "prime",
    //                     "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e",
    //                     items: [{
    //                         "name": "SWT",
    //                         "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e"
    //                     },
    //                     {
    //                         "name": "ABR",
    //                         "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e"
    //                     },
    //                     {
    //                         "name": "HRN",
    //                         "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e"

    //                     },
    //                     {
    //                         "name": "FIL",
    //                         "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e",
    //                         items: [
    //                             {
    //                                 "name": "SLB",
    //                                 "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e",
    //                             },
    //                             {
    //                                 "name": "ADR",
    //                                 "id": "3c116c64-e008-4cae-ad9b-3309d3e5eb7e",
    //                             },
    //                             // ..... so on
    //                         ]
    //                     },
    //                     ]
    //                 },
    //                 ]
    //             },
    //         ]
    //     },

    // ];








    const data = [
    {
        name: "item_segment",
        id: "3c116c64-e008-4cae-ad9b-3309d3e5eb7e",
        group: false,
        value: ["0", "Automobile", "CPG", "Pharma", "Technology", "Tyres"],
    },
    {
        name: "category",
        id: "d8ba2a43-6a07-4254-9e77-70097e114e16",
        group: false,
        value: ["Electrical", "Mechanical", "Personal care", "skincare"],
    },
    {
        name: "classification",
        id: "5d4bceb7-9059-43ab-bddf-b2fe02afed4f",
        group: false,
        value: [
            "Facewash",
            "Femcare",
            "Focus",
            "Haircare",
            "Prime",
            "Soaps",
        ],
    },
    {
        name: "p_group",
        id: "3e4f4b4a-20be-4299-887c-9fef66b69097",
        group: true,
        value: [
            "ABC",
            "BAH",
            "BLK",
            "BRF",
            "BRK",
            "Santoor",
            "Stayfree",
            "VLCC",
            "Whisper",
        ]
    },
    {
        name: "country",
        id: "ee8ee9c0-96b0-4aa3-9856-77df527266c7",
        group: false,
        value: ["India"],
    },
    {
        name: "geography",
        id: "9881b945-0d48-4736-86e4-35e79632087c",
        group: false,
        value: ["East", "North", "South", "West"],
    },
    {
        name: "region",
        id: "b42e22ef-b237-4166-a083-99c13ccbd88f",
        group: false,
        value: ["East-1", "East-2", "North-1", "West-7"],
    },
    {
        name: "subgroup",
        id: "7a47ae2e-0a53-4952-9322-91a8a898016e",
        group: true,
        value: ["ABS", "ACR", "ACS", "HTR", "YOK"],
    },
    {
        name: "salesperson",
        id: "f8080594-c666-46dd-872f-3661bcb2f344",
        group: false,
        value: [
            "admin",
            "demanduser",
            "demanduser2",
            "salesuser1",
            "salesuser2",
            "SP1",
            "SP2",
            "SP3",
        ],
    },
];



    const [selectedItems, setSelectedItems] = useState({
        item_segment: "",
        category: "",
        classification: "",
        p_group: "",
        subgroups: "",
        country: "",
        geography: "",
        region: "",
        salesperson: "",
    });

    const [expanded, setExpanded] = useState({});



    useEffect(() => {
        // getProducts()
    }, [])
    // const getProducts = async () => {
    //     try {
    //         // Construct the full URL by directly appending the query parameter
    //         // const url = `${REACT_APP_API_BASE_URL}/weekly_workflow_data?workflow_id=${workflow.workflow_id}`;
    //         const url = `${REACT_APP_API_BASE_URL}/weekly_workflow_data?workflow_id=${14}`;
    //         // 
    //         // Perform the GET request
    //         const response = await axios.get(url, {
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json",
    //                 // access_token: UserService.getToken(), // Replace with your token retrieval function
    //             },
    //         });

    //     } catch (error) {
    //         // Handle errors
    //         console.error("Error fetching workflows:", error.message);
    //         throw error;
    //     }
    // }


    const handleCheck = (name, value) => {
        setSelectedItems((prevSelected) => ({
            ...prevSelected,
            [name]: value,
        }));
    };


    const toggleExpand = (name) => {
        setExpanded((prevExpanded) => ({
            ...prevExpanded,
            [name]: !prevExpanded[name],
        }));
    };

    return (
        <div>
            <br />
            <br />
            <br />
            <br />
            {isLoading && <div style={{ marginTop: "20vh", height: "50vh" }} className='text-center'>
                <Loader size="large" />
            </div>}
            {!isLoading && <div className="flex flex-col md:flex-row gap-4 p-4 h-screen overflow-hidden ">
                {/* Left Panel: Tree View */}
                <div className="tree-container md:w-2/3 w-full overflow-y-auto pr-4">
                    {data.map((item) => (
                        <div key={item.id} className="mb-4">
                            {/* Header with Expand/Collapse */}
                            <div
                                className="flex items-center gap-2"
                                onClick={() => toggleExpand(item.name)}
                            >
                                <button

                                    className="px-2 py-1 bg-gray-200 rounded"
                                >
                                    {expanded[item.name] ? "-" : "+"}
                                </button>
                                <strong>{item.name}</strong>
                            </div>

                            {/* Values (visible when expanded) */}
                            {expanded[item.name] && (
                                <div className="ml-6">
                                    {item.value.map((val, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="radio" // For single selection fields
                                                name={item.name}
                                                checked={selectedItems[item.name] === val}
                                                onChange={() => handleCheck(item.name, val)}
                                            />
                                            <span>{val}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Panel: Selected Items */}
                <div className="selected-container md:w-1/3 w-full bg-gray-100 p-4 fixed md:static bottom-0 md:bottom-auto right-0 md:right-auto h-64 md:h-full overflow-y-auto">
                    <h2 className="font-bold mb-2">Selected Items</h2>
                    <div className="bg-white p-4 rounded shadow">
                        <pre>{JSON.stringify(selectedItems, null, 2)}</pre>
                    </div>
                </div>
            </div>}

        </div>
    )
}

export default SKU
// const data = [
//     {
//         name: "item_segment",
//         id: "3c116c64-e008-4cae-ad9b-3309d3e5eb7e",
//         group: false,
//         value: ["0", "Automobile", "CPG", "Pharma", "Technology", "Tyres"],
//     },
//     {
//         name: "category",
//         id: "d8ba2a43-6a07-4254-9e77-70097e114e16",
//         group: false,
//         value: ["Electrical", "Mechanical", "Personal care", "skincare"],
//     },
//     {
//         name: "classification",
//         id: "5d4bceb7-9059-43ab-bddf-b2fe02afed4f",
//         group: false,
//         value: [
//             "Facewash",
//             "Femcare",
//             "Focus",
//             "Haircare",
//             "Prime",
//             "Soaps",
//         ],
//     },
//     {
//         name: "p_group",
//         id: "3e4f4b4a-20be-4299-887c-9fef66b69097",
//         group: true,
//         value: [
//             "ABC",
//             "BAH",
//             "BLK",
//             "BRF",
//             "BRK",
//             "Santoor",
//             "Stayfree",
//             "VLCC",
//             "Whisper",
//         ]
//     },
//     {
//         name: "country",
//         id: "ee8ee9c0-96b0-4aa3-9856-77df527266c7",
//         group: false,
//         value: ["India"],
//     },
//     {
//         name: "geography",
//         id: "9881b945-0d48-4736-86e4-35e79632087c",
//         group: false,
//         value: ["East", "North", "South", "West"],
//     },
//     {
//         name: "region",
//         id: "b42e22ef-b237-4166-a083-99c13ccbd88f",
//         group: false,
//         value: ["East-1", "East-2", "North-1", "West-7"],
//     },
//     {
//         name: "subgroup",
//         id: "7a47ae2e-0a53-4952-9322-91a8a898016e",
//         group: true,
//         value: ["ABS", "ACR", "ACS", "HTR", "YOK"],
//     },
//     {
//         name: "salesperson",
//         id: "f8080594-c666-46dd-872f-3661bcb2f344",
//         group: false,
//         value: [
//             "admin",
//             "demanduser",
//             "demanduser2",
//             "salesuser1",
//             "salesuser2",
//             "SP1",
//             "SP2",
//             "SP3",
//         ],
//     },
// ];

