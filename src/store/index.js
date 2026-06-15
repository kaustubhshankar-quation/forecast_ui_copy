import { configureStore } from "@reduxjs/toolkit";
import workflowReducer from "./slices/workflowSlice";

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
  },
});