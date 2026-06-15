import React , { useContext } from 'react';
import { WorkflowStagesData } from '../../Utils/dataWorkflowStages';
import MenuContext from './MenuContext';

function Banner() {

    const { activeTab } = useContext(MenuContext);

    const  stageObj = WorkflowStagesData[activeTab];
    //console.log(WorkflowStagesData);
    

    return (
        <div>
            <div className="container-fluid  ">
                <div className="container mycontainer">
                    <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <div className="createworkflowsection1">
                                <h4>{stageObj.Title}</h4>
                                <p>{stageObj.Subtitle}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner