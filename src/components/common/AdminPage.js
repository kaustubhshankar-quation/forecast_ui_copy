import React from 'react'
import UploadFile from '../comparison/UploadFile'
import Breadcrumb from './Breadcrumb'

const AdminPage = () => {
    return (
        <div style={{ backgroundColor: "#F4F7FC" }}>
            <Breadcrumb List={[{ path:"/Dashboard", name:"Dashboard"},{path:"#", name:"Upload Planned Data"}]} />
            <UploadFile />
        </div>
    )
}

export default AdminPage