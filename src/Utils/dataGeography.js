import { getRequest, ApiEnums } from "../services/DataRequestService";

export function addBreadcrumbs(data) {
  // Get the number of levels from mapping object
  const levels = Object.keys(data.mapping).length;
  
  // Create lookup maps for all levels dynamically
  const levelMaps = {};
  
  // Dynamically create maps for all levels
  for (let i = 1; i <= levels; i++) {
    const currentLevelKey = `level${i}`;
    
    // If the current level exists in the data
    if (data[currentLevelKey]) {
      if (i === 1) {
        // For first level, use simple ID mapping
        levelMaps[currentLevelKey] = Object.fromEntries(
          data[currentLevelKey].map((level) => [
            level[`level${i}_id`],
            level.name
          ])
        );
      } else {
        // For subsequent levels, use composite key mapping
        levelMaps[currentLevelKey] = Object.fromEntries(
          data[currentLevelKey].map((level) => {
            // Create a composite key from previous levels' IDs
            const compositeKey = Array.from({ length: i }, (_, idx) =>
              level[`level${idx + 1}_id`]
            ).join('_');
            return [compositeKey, level.name];
          })
        );
      }
    }
  }

  // Process each level
  for (let targetLevel = 1; targetLevel <= levels; targetLevel++) {
    const targetLevelKey = `level${targetLevel}`;
    
    // Skip if the level doesn't exist in data
    if (!data[targetLevelKey]) continue;
    
    data[targetLevelKey] = data[targetLevelKey].map((item) => {
      // Build breadcrumb components dynamically
      const breadcrumbParts = [];
      const idParts = []; // To collect IDs for constructing the `id` property
      
      // Only include levels up to the current target level
      for (let i = 1; i <= targetLevel; i++) {
        const currentLevelKey = `level${i}`;
        
        // For the last level (current item), use its own name
        if (i === targetLevel) {
          breadcrumbParts.push(item.name);
          idParts.push(item[`level${i}_id`]);
          continue;
        }
        
        // Construct the lookup key
        const lookupKey = i === 1
          ? item[`level${i}_id`]
          : Array.from({ length: i }, (_, idx) =>
              item[`level${idx + 1}_id`]
            ).join('_');
        
        // Get the name, with fallback using mapping
        const levelName = levelMaps[currentLevelKey]?.[lookupKey] ||
          `Unknown ${data.mapping[currentLevelKey] || `Level ${i}`}`;
        
        // Add to breadcrumb parts if name exists
        if (levelName) {
          breadcrumbParts.push(levelName);
        }
        
        // Add the current level's ID to `idParts`
        idParts.push(item[`level${i}_id`]);
      }
      
      const id = idParts.join('_');
      
      return {
        ...item,
        breadcrumb: breadcrumbParts.join('\\'),
        id,
      };
    });
  }
  
  return data;
}

const getGeographyHeirarchy = async () => {
    
    let requestObject = {
      url: ApiEnums.getgeohierarchy,
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

  export { getGeographyHeirarchy }