const WorkflowStagesData = {
    Stage1: {
      Id: "Stage1",
      Title: "Initialize Workflow",
      Subtitle: "Initiates the forecasting task by gathering essential details such as workflow name and description."
    },
    Stage2: {
      Id: "Stage2",
      Title: "Temporal Settings",
      Subtitle: "Define the temporal parameters, including start and end dates for training, validation, and test periods. Also, select the forecast frequency (daily, weekly, etc.)."
    },    
    Stage3: {
      Id: "Stage3",
      Title: "Data Selection",
      Subtitle: "Establishes the hierarchy for forecasting, enabling users to specify location (store_id, US state name) and product (category, dept, brand, etc.) preferences. Allows flexible combination and selection for model creation."
    },
    Stage4: {
      Id: "Stage4",
      Title: "Data Availability",
      Subtitle: "Assesses the availability of sufficient data for all created hierarchy combinations (location, product hierarchy combos) to make informed decisions on inclusion in the forecasting workflow."
    },
    Stage5: {
      Id: "Stage5",
      Title: "Promotions",
      Subtitle: "Promotions"
    },
    Stage6: {
      Id: "Stage6",
      Title: "Model Selection",
      Subtitle: "Provides a platform for users to choose from a variety of forecasting models (ARIMA, TBAT, NBEATS, LightGBM, XGBoost, CatBoost, Holt Winters, TSLM, etc.) based on their preferences and requirements."
    },
    Stage7: {
      Id: "Stage7",
      Title: "Review & Launch Workflow",
      Subtitle: "Summarizes all user selections and decisions made throughout the workflow configuration process before finalizing and submitting the forecasting task."
    }
  }

  export { WorkflowStagesData }