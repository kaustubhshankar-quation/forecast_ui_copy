import React from 'react'
import Breadcrumb from '../components/common/Breadcrumb';
import { getCookie } from '../services/DataRequestService';

function MyProfile() {
  return (
    <div>
      <Breadcrumb List={[{ path: "/Dashboard", name: "Dasboard" }, { path: "#", name: "My Profile" }]} />
      <div className="mycontainer flex justify-center profile-container">
        <table className="table reviewtable table-bordered table-hover" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{getCookie('username')?.toUpperCase()}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{getCookie('email')?.toUpperCase()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyProfile;
