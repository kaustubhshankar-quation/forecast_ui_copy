import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workflow: null,
  steps: [],
  // New state for tree and reports
  combinations: [],
  selectedNode: null, // { level, item }
  selectedSkuIds: [], // array of sku_ids
  selectedProduct: null,
  selectedLocation: null,
  activeReportTab: "Report1",
  selectedModel: null,
  bestActPredData: null,
  bestModelData: null,
  bestForecasteData: null,
  multipleActPredData: null,
  multipleModelData: null,
  multipleForecastData: null,
  isBestModelMode: false,
};
console.log("action came",);
const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    setWorkflow: (state, action) => {
      state.workflow = action.payload;
      console.log("action", action);
    },
    addStep: (state, action) => {
      state.steps.push(action.payload);
    },
    removeStep: (state, action) => {
      state.steps = state.steps.filter(
        (step) => step.id !== action.payload
      );
    },
    resetWorkflow: () => initialState,
    // New reducers
    setCombinations: (state, action) => {
      state.combinations = action.payload;
    },
    setSelectedNode: (state, action) => {
      state.selectedNode = action.payload;
    },
    setSelectedSkuIds: (state, action) => {
      state.selectedSkuIds = action.payload;
    },
    setSelectedProductLocation: (state, action) => {
      state.selectedProduct = action.payload.product;
      state.selectedLocation = action.payload.location;
    },
    setActiveReportTab: (state, action) => {
      state.activeReportTab = action.payload;
    },
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
    setBestModelMode: (state, action) => {
      state.isBestModelMode = action.payload;
    },
    
    setApiPayloadsBestModel: (state, action) => {
      state.bestActPredData = action.payload.bestActPredData || null;
      state.bestModelData = action.payload.bestModelData || null;
      state.bestForecasteData = action.payload.bestForecasteData || null;
    },
    setApiPayloads: (state, action) => {
      state.multipleActPredData = action.payload.multipleActPredData || null;
      state.multipleModelData = action.payload.multipleModelData || null;
      state.multipleForecastData = action.payload.multipleForecastData || null;
    },
  },
});

export const {
  setWorkflow,
  addStep,
  removeStep,
  resetWorkflow,
  setCombinations,
  setSelectedNode,
  setSelectedSkuIds,
  setSelectedProductLocation,
  setActiveReportTab,
  setSelectedModel,
  setApiPayloadsBestModel,
  setApiPayloads,
} = workflowSlice.actions;

export default workflowSlice.reducer;