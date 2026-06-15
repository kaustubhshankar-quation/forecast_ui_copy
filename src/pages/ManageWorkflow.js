import React, { useEffect } from 'react'
import Breadcrumb from '../components/common/Breadcrumb';
import Banner from '../components/workflow/Banner';
import WorkFlowsData from '../components/workflow/WorkflowsData';
import { useLocation } from "react-router-dom";


function ManageWorkflow() {
  const location = useLocation();
 // console.log(location)
  return (
    <>
        <Breadcrumb  List={[{ path:"/Dashboard", name:"Dasboard"},{path:"#", name: `${location.pathname.toLocaleLowerCase() === '/manageworkflow' ? "Manage Workflow" :location.pathname.toLocaleLowerCase() === '/comparison' ? "comparison": location.pathname.toLocaleLowerCase() === '/indentation'  ? 'Indentation' : location.pathname}` }]} />
        {/* <Banner /> */}
        <WorkFlowsData PathName={location.pathname?.toLocaleLowerCase()} />
    </>
  )
}

export default ManageWorkflow;