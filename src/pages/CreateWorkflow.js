import React from 'react'
import Breadcrumb from '../components/common/Breadcrumb';
import Banner from '../components/createworkflow/Banner';
import Workflowtabs from '../components/createworkflow/Workflowtabs';
import {DataProvider} from '../components/createworkflow/DataContext';
import { FormProvider } from '../components/createworkflow/FormContext';
import { MenuProvider } from '../components/createworkflow/MenuContext';


function CreateWorkflow() {
  
  return (
    <>
      <FormProvider>
        <MenuProvider>
          <DataProvider>
          <Breadcrumb List={[{ path:"/Dashboard", name:"Dasboard"},{path:"#", name:"Create Workflow"}]} />
          {/* <Banner /> */}
          <Workflowtabs />
          </DataProvider>
        </MenuProvider>
      </FormProvider>
    </>
  )
}

export default CreateWorkflow;
