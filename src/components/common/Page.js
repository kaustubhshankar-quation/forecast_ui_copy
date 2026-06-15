import React from 'react';
import {
    Outlet
} from 'react-router-dom'


function Page() {
  return (
    <Panel>
     <Outlet />
    </Panel>
  )
}

function Panel({children}){
  return(<div className='mainbgcolor' >
    {children}
  </div>)
}

export default Page;


