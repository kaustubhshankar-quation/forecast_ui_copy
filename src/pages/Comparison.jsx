import React from 'react'
import Breadcrumb from '../components/common/Breadcrumb';
import ManageWorkflowForComparison from '../components/workflow/ManageWorkflowForComparison';


function Comparison() {
    const pageName = 'Comparison'

    return (
        <>
            <Breadcrumb List={[{ path:"/Dashboard", name:"Dashboard"},{path:"#", name:"Comparison Workbench"}]} />
            <ManageWorkflowForComparison />
        </>
    )
}

export default Comparison;