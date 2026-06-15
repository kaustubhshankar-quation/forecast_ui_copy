import { fetchRecordByKey } from "../../services/IndexedDBUtil";

export function stage4PreparePayload(formData) {
    const payload = JSON.parse(`{
    "temporalSettings" : {
      "user_id": "",
      "workflow_id": "",
      "start_date": "",
      "end_date": "",
      "data_frequency": "",
      "forecast_frequency": "",
      "forecast_period": "",
      "train_percentage":"",
      "test_percentage": ""
    },
    "skuList": [],
    "geolevels": []
  }`);

    payload.temporalSettings.user_id = formData.user_id;
    payload.temporalSettings.start_date = formData.stage2.start_date;
    payload.temporalSettings.end_date = formData.stage2.end_date;
    payload.temporalSettings.workflow_id = formData.stage1.data_upload_id ? formData.stage1.data_upload_id : formData.id;
    payload.temporalSettings.data_frequency = formData.stage2.data_frequency;
    payload.temporalSettings.forecast_frequency = formData.stage2.forecast_frequency;
    payload.temporalSettings.forecast_period = extractNumber(formData.stage2.forecast_period);
    payload.temporalSettings.train_percentage = formData.stage2.train_percentage;
    payload.temporalSettings.test_percentage = formData.stage2.test_percentage;
    payload.skuList = convertProductsToSkuList(formData?.stage3?.products);
    payload.geolevels = convertGeographyData(formData?.stage3?.geography);

    return payload;
}

function convertProductsToSkuList(products) {
    if (!products) {
        return [];
    }
    return products.map((product) => {
        const { id, breadcrumb } = product;

        // Extract levels from the id
        const [level1_id = 0, level2_id = 0, level3_id = 0, level4_id = 0, level5_id = 0, sku_id = 0] = id.split("_").map(Number);

        // Extract the last part of the breadcrumb for the sku_name
        const sku_name = breadcrumb.split("\\").pop();        
        const level6_id = sku_id
        // Construct the desired object
        return {
            sku_id, // Use level6 from id as sku_id
            sku_name,
            level1_id,
            level2_id,
            level3_id,
            level4_id,
            level5_id,
            level6_id,
            combination: breadcrumb // Add combination from breadcrumb
        };
    });
}

function convertGeographyData(geography) {
    if (!geography) {
        return [];
    }
    return geography.map((geo) => {
        const { id, breadcrumb } = geo;

        // Extract levels from id, fill missing levels with null
        const [level1_id = null, level2_id = null, level3_id = null, level4_id = null, level5_id = null] = id.split("_");

        // Split breadcrumb into parts and fill missing levels with empty string
        const [level1 = "", level2 = "", level3 = "", level4 = "", level5 = ""] = breadcrumb.split("\\");

        // Construct the desired object
        return {
            level1,
            level2,
            level3,
            level4,
            level5,
        };
    });
}

/**
 * Extracts the first number from a given string.
 * @param {string} str - The input string.
 * @returns {number|null} - The extracted number or null if no number is found.
 */
function extractNumber(str) {
    const match = String(str ?? "").match(/\d+/);
    return match ? parseInt(match[0], 10) + 1 : null;
}

export const toggleErrorVisibility = (condition, inputControl, errorControl, errorMessage = "* Required") => {
    //console.log("condition", condition);
    if (condition) {
        inputControl?.classList?.add("highlighted");
        errorControl?.classList.add("visible");
        errorControl?.classList.remove("hidden");
        errorControl.innerText = errorMessage;
    } else {
        inputControl?.classList.remove("highlighted");
        errorControl?.classList.add("hidden");
        errorControl?.classList.remove("visible");
        errorControl.innerText = "";
    }
}

export function Stage4DummyTablePrep(products, geographies) {
    let TableData = [];

    // Helper function to generate random number within a range
    const getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    // Generate all combinations
    for (let product of products) {
        for (let geo of geographies) {
            const availNumber = getRandomNumber(80000, 200000);
            const selectedCount = getRandomNumber(1000, 40000);

            const rowJSX = (
                <tr key={`${product.id}_${geo.id}`}>
                    <td>
                        <div className="">
                            <span>{product.breadcrumb.replaceAll("\\", " → ")}</span>
                        </div>
                    </td>
                    <td>
                        <div className="daselecteditem">
                            <span>{geo.breadcrumb.replaceAll("\\", " → ")}</span>
                        </div>
                    </td>
                    <td><span>{availNumber}</span></td>
                    <td><span>{selectedCount}</span></td>
                </tr>
            );
            TableData.push(rowJSX);
        }
    }

    // Create the complete table JSX
    const completeTableJSX = (
        <table className="table dataselectiontable table-bordered">
            <thead>
                <tr>
                    <th>Selected SKU'S</th>
                    <th>Selected Geographies</th>
                    <th>Total<br /> Available Data</th>
                    <th>Total<br /> Selected Data</th>
                </tr>
            </thead>
            <tbody>
                {TableData}
            </tbody>
        </table>
    );

    return completeTableJSX;
}

export async function Stage4TablePrep(response) {
    let rows = [];
    let res = await fetchRecordByKey("MyDatabase", "myStore", "SKUS", 1);
    if (res.success && res.record) {
        for (let combination of response.combinations) {
            let skuArray = [combination.sku];
            let geographyArray = [combination.geography];
            let _skuBreadcrumbs = getbreadcrumbs(skuArray, res.record.data)
            rows.push({
                skuBreadcrumb: _skuBreadcrumbs,
                geoBreadcrumb: geographyArray.map((item) => {
                    // Collect levels into an array
                    const levels = [
                        item.level1,
                        item.level2,
                        item.level3,
                        item.level4,
                        item.level5,
                    ];
                    // Remove empty strings and concatenate with underscores
                    return levels.filter(level => level !== "").join("\\");
                })[0],

                train_threshold: combination.train_threshold,
                test_threshold: combination.test_threshold,

                train_data_available: combination.train_data_available,
                test_data_available: combination.test_data_available,

                sku: combination.sku,
                geography: combination.geography,
            });
        }
    }
    //console.log(rows)
    rows.sort((a, b) => b.train_data_available - a.train_data_available);
    return rows; // Return raw data for table rows
}

function getbreadcrumbs(sku, record) {
    return sku.map((item) => {
        // Get only non-zero level IDs from level1 to level6
        const levels = [
            item.level1_id,
            item.level2_id,
            item.level3_id,
            item.level4_id,
            item.level5_id,
            item.level6_id
        ];
        const validLevels = levels.filter(id => id !== 0);
        const idPrefix = validLevels.join('_');

        // Find matching record where record.id starts with the idPrefix
        const matched = record.find((rec) => rec.id.startsWith(idPrefix));

        if (matched) {
            const breadcrumbParts = matched.breadcrumb.split('\\');
            const resultBreadcrumb = breadcrumbParts.slice(0, validLevels.length).join('\\');
            return resultBreadcrumb;
        }

        return null;
    }).filter(Boolean)[0] || null; // return first match or null
}

const handleCheckboxChange = (e) => {
    console.log("Checkbox Changed", e.target.dataset);
    // Add your logic here to update your state based on the checkbox change
}

export function SubmitWorkflowPayloadPrep(formData) {
    const payload = JSON.parse(`{
            "modelInput": {
                "user_id": "",
                "workflow_id": "",
                "data_upload_id": "",
                "start_date": "",
                "end_date": "",
                "data_frequency": "",
                "forecast_frequency": "",
                "forecast_period": 0,
                "models_list": [],
                "forecast_horizon": 0,
                "workflow_desc": "",
                "workflow_name": ""
            },
    "skuSelections": []
        }`);

    payload.modelInput.user_id = formData.user_id;
    payload.modelInput.workflow_id = formData.id;

    payload.modelInput.data_upload_id = formData.stage1.data_upload_id;

    payload.modelInput.start_date = formData.stage2.start_date;
    payload.modelInput.end_date = formData.stage2.end_date;

    payload.modelInput.workflow_name = formData.stage1.workflow_name;
    payload.modelInput.workflow_desc = formData.stage1.workflow_description;

    payload.modelInput.data_frequency = formData.stage2.data_frequency;
    payload.modelInput.forecast_frequency = formData.stage2.forecast_frequency;
    payload.modelInput.forecast_period = extractNumber(formData.stage2.forecast_period);
    payload.modelInput.train_percentage = formData.stage2.train_percentage;
    payload.modelInput.test_percentage = formData.stage2.test_percentage;

    // Enhanced skuSelections with combination breadcrumbs from stage3
    const productMap = new Map(
        (formData.stage3?.products || []).map((product) => [product.id, product.breadcrumb])
    );

    payload.skuSelections = (formData.stage4?.combinations || []).map((elem) => {
        const sku = elem.sku || {};
        const productId = [
            sku.level1_id || 0,
            sku.level2_id || 0,
            sku.level3_id || 0,
            sku.level4_id || 0,
            sku.level5_id || 0,
            sku.level6_id || sku.sku_id || 0
        ].join("_");
        
        const combination = productMap.get(productId) || "";
        
        return {
            skuDetails: {
                ...sku,
                combination
            },
            geoDetails: elem.geography
        };
    });

    payload.modelInput.models_list = formData.stage6?.models || [];
    
    console.log("Final Payload:", payload);
    return payload;
}

export function filterSelectedItems(selectedItems, newItems) {
    // If newItems is a single item, convert it to an array
    const newItemsArray = Array.isArray(newItems) ? newItems : [newItems];
    //console.log(`newItemsArray`, newItemsArray)
    return selectedItems.filter(item => {
        const itemParts = item.id.split('_');

        // Check against each new item
        return !newItemsArray.some(newItem => {
            const newItemParts = newItem.id.split('_');

            // Check if current item is a parent path of newItem
            const isParentPath = newItemParts.length > itemParts.length &&
                itemParts.every((part, index) => part === newItemParts[index]);

            // Check if current item is a child of newItem
            const isChild = itemParts.length > newItemParts.length &&
                newItemParts.every((part, index) => part === itemParts[index]);

            // Return true if the item should be removed (is either parent or child)
            return isParentPath || isChild;
        });
    });
}