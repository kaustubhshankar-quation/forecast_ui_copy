import React from 'react';
import Breadcrumb from '../components/common/Breadcrumb';

function IndentationPage() {
  return (
    <div>
         <Breadcrumb List={[{ path:"/Dashboard", name:"Dasboard"},{path:"#", name:"Indentation"}]} />
    </div>
  )
}

export default IndentationPage
