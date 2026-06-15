// validation.js
export const validateStage1 = (data) => {
    const errors = {};
    
    if (!data?.workflow_name?.trim()) {
      errors.workflow_name = 'Workflow name is required';
    } else if (data.workflow_name.length < 3) {
      errors.workflow_name = 'Workflow name must be at least 3 characters';
    }
  
    if (!data?.workflow_description?.trim()) {
      errors.workflow_description = 'workflow description is required';
    }

    if(!data?.file_upload_status || !data?.file_upload_status[0]?.success){
        errors.file1 = "forecast file not updated"
    }

    if(!data?.file_upload_status || !data?.file_upload_status[1]?.success){
        errors.file2 = "EOQ file not updated"
    }

    if(!data?.file_upload_status || !data?.file_upload_status[2]?.success){
        errors.file3 = "Inventory file not updated"
    }

    if(!data?.file_upload_status || !data?.file_upload_status[3]?.success){
        errors.file4 = "safety stock file not updated"
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
export const validateStage2 = (data) => {
  const errors = {};

  if (!data?.data_frequency) {
    errors.data_frequency = 'Data Frequency is required';
  }

  if(!data?.product_category){
    errors.product_category = 'Product Category is required';
  }

  if (!data?.train_percentage) {
    errors.train_percentage = 'Training Period is required';
  } else if (isNaN(data.train_percentage) || data.train_percentage < 0 || data.train_percentage > 100) {
    errors.train_percentage = 'Training Period must be a number between 0 and 100';
  }

  if (!data?.forecast_frequency) {
    errors.forecast_frequency = 'Forecast Frequency is required';
  }

  if (!data?.forecast_period) {
    errors.forecast_period = 'Forecast Period is required';
  }
 //console.log(errors)
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
  
  export const validateStage3 = (data) => {
    const errors = {};
    
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };


  export const validateStage4 = (data) => {
    const errors = {};
    
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  export const validateStage5 = (data) => {
    const errors = {};
    
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  export const validateStage6 = (data) => {
    const errors = {};
    
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  export const validateStage7 = (data) => {
    const errors = {};
    
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  // Add similar validation functions for other stages...
  
  // Helper function to validate any stage
  export const validateStage = (stageNumber, data) => {
    const validationFunctions = {
      1: validateStage1,
      2: validateStage2,
      3: validateStage3,
      4: validateStage4,
      5: validateStage5,
      6: validateStage6,
      7: validateStage7,
      // Add other stages...
    };
  
    const validateFn = validationFunctions[stageNumber];
    if (!validateFn) {
      throw new Error(`No validation function found for stage ${stageNumber}`);
    }
  
    return validateFn(data);
  };