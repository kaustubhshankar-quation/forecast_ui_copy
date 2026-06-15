import { getRequest, ApiEnums } from "../services/DataRequestService";
//import apiDataProductHeirarchy from './DataSamples/SampleProductHeirarchy.json'
import { addBreadcrumbs } from "./dataGeography";

function addBreadcrumbs_old(data) {
  // Create lookup maps for all levels dynamically
  const levelMaps = {};
  
  // Dynamically create maps for levels 1 to 5
  for (let i = 1; i <= 5; i++) {
    const currentLevelKey = `level${i}`;
    const nextLevelKey = `level${i + 1}`;
    
    // If the current level exists in the data
    if (data[currentLevelKey]) {
      if (i === 1) {
        // For first level, use simple ID mapping
        levelMaps[currentLevelKey] = Object.fromEntries(
          data[currentLevelKey].map((level) => [level[`level${i}_id`], level.name])
        );
      } else {
        // For subsequent levels, use composite key mapping
        levelMaps[currentLevelKey] = Object.fromEntries(
          data[currentLevelKey].map((level) => {
            // Create a composite key from previous levels' IDs
            const compositeKey = Array.from({length: i}, (_, idx) => 
              level[`level${idx + 1}_id`]
            ).join('_');
            return [compositeKey, level.name];
          })
        );
      }
    }
  }

  // Process the target level (level3 in original example, but flexible)
  const targetLevelKey = 'level6';
  data[targetLevelKey] = data[targetLevelKey].map((targetLevel) => {
    // Build breadcrumb components dynamically
    const breadcrumbParts = [];
    const idParts = []; // To collect IDs for constructing the `id` property

    for (let i = 1; i <= 5; i++) {
      const currentLevelKey = `level${i}`;
      
      // Construct the lookup key
      const lookupKey = i === 1 
        ? targetLevel[`level${i}_id`]
        : Array.from({length: i}, (_, idx) => 
            targetLevel[`level${idx + 1}_id`]
          ).join('_');
      
      // Get the name, with fallback
      const levelName = levelMaps[currentLevelKey]?.[lookupKey] || 
        `Unknown ${data?.mapping?.[currentLevelKey]?.slice(0, -7) || `Level ${i}`}`;
      
      // Add to breadcrumb parts if name exists
      if (levelName) {
        breadcrumbParts.push(levelName);
      }
       // Add the current level's ID to `idParts`
       idParts.push(targetLevel[`level${i}_id`]);
    }

    // Add the current level's name
    breadcrumbParts.push(targetLevel.name);

     // Construct the `id` by joining all IDs with `_`
     idParts.push(targetLevel[`level${6}_id`]);
     const id = idParts.join('_');

    return {
      ...targetLevel,
      breadcrumb: breadcrumbParts.join('\\'),
      id, // Add the new `id` property
    };
  });

  return data;
}

const getProductHeirarchy = async () => {
  //  const result = await addBreadcrumbs(apiDataProductHeirarchy.data);
  //  return result;
  let requestObject = {
    url: ApiEnums.getproducthierarchy,
  };
  const responseData = await getRequest(requestObject);
  if (responseData.status === "success") {
    const result = await addBreadcrumbs(responseData.data);
    return result;
  } else if (responseData.status === "failed") {
    console.log(responseData.message);
    return null;
  }
};

export { getProductHeirarchy };
