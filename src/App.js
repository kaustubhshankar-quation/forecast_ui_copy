import React, { useEffect } from "react";
import "./App.css";
import styled from "styled-components";
import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./assets/css/css.css";
import "./assets/css/responisve.css";
import "./assets/css/menu.css";
import "./assets/css/flexslider.css";
import "./assets/css/bannerslider.css";

import Dashboard from "./pages/Dashboard";
import CreateWorkflow from "./pages/CreateWorkflow";
import ManageWorkflow from "./pages/ManageWorkflow";
import MyProfile from "./pages/MyProfile";
import WorkflowDetails from "./pages/WorkflowDetails";
import IndentationPage from "./components/indentation/IndentationPage";
import SKU from "./pages/SKU";
import UploadFile from "./components/comparison/UploadFile";
import ComparisonTable from "./components/comparison/ComparisonTable";
import SalesPersonPage from "./pages/SalesPersonPage";
import SKUSalesPersonMapPage from "./pages/SKUSalesPersonMapPage";

// ✅ new imports for Collaboration Dashboard
import ManageWorkflowForComparison from "./components/workflow/ManageWorkflowForComparison";

import Navbar from "./components/common/Navbar";
import AdminNavbar from "./components/common/AdminNavbar";
import Footer from "./components/common/Footer";
import Page from "./components/common/Page";
import AdminPage from "./components/common/AdminPage";
import BorderedPage from "./components/common/BorderedPage";

import { getCookie } from "./services/DataRequestService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Base from "./components/QC/Base";

// ✅ ROUTER CONFIGURATION
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/createworkflow" element={<CreateWorkflow />} />
      <Route path="/manageworkflow" element={<ManageWorkflow key="manageworkflow" />} />

      <Route path="/comparison" element={<ManageWorkflowForComparison key="comparison" />} />
      <Route path="/collaboration" element={<ManageWorkflowForComparison />} />

      <Route path="/indentation" element={<ManageWorkflow key="indentation" />} />
      <Route path="/indent" element={<IndentationPage />} />
      <Route path="/myprofile" element={<MyProfile />} />
      <Route path="/workflow" element={<WorkflowDetails />} />
      <Route path="/wf/upload" element={<UploadFile />} />
      <Route path="/wf/comparison" element={<ComparisonTable />} />
      <Route path="/sku" element={<SKU />} />
      <Route path="/sales-person" element={<SalesPersonPage />} />
      <Route path="/sales-person-sku-mapping" element={<SKUSalesPersonMapPage />} />
      <Route path="/QC" element={<Base />} />

    </Route>
  )
);

// ✅ Layout wrapper for admin / non-admin
function AppLayout() {
  return (
    <Wrapper className="root">
        {Boolean(getCookie("isadminrole")) ? (
          <>
            <Navbar />
            <BorderedPage>
              <Page />
            </BorderedPage>
            <Footer />
          </>
        ) : (
          <>
            <AdminNavbar />
            {/* <BorderedPage /> */}
            <AdminPage />
            {/* <BorderedPage /> */}
            <Footer />
          </>
        )}
    </Wrapper>
  );
}

// ✅ Main App
function App() {
  useEffect(() => {
    const scripts = ["js/jquery.min.js", "js/js.js", "js/jquery.flexslider.js"];

    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load: ${src}`));
        document.body.appendChild(script);
      });

    (async () => {
      for (const src of scripts) {
        try {
          await loadScript(src);
        } catch (err) {
          console.error(err);
        }
      }
    })();

    return () => {
      scripts.forEach((src) => {
        const script = document.querySelector(`script[src="${src}"]`);
        if (script) document.body.removeChild(script);
      });
    };
  }, []);

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
