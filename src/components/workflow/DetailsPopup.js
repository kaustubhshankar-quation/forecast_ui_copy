import React from 'react'
import styled from 'styled-components';

export default function DetailsPopup({ onClose, workflowData }) {
  return (
    <>
      <Wrapper>
        {/* Overlay for faded background */}
        <div className="modal-overlay" onClick={onClose}></div>
        <div id="login" className="modal modal-login fade in" style={{ display: 'block' }} >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
              <div className="motit">
                  <button type="button" onClick={onClose} className="close"><iconify-icon icon="material-symbols:close"></iconify-icon></button>
                </div>
                <center><h1>Workflow Details</h1></center>
                <div class="article table-responsive">
                  <table class="table reviewtable table-bordered">
                    <tbody>
                      <tr>
                        <td colSpan={2} >
                          <center>Initialize Workflow</center>
                        </td>
                      </tr>
                      <Row title={"Workflow Name"}>{workflowData?.workflow_name}</Row>
                      <Row title={"Workflow Description"}>{workflowData?.workflow_description}</Row>
                      <Row title={"Workflow Status"}>{workflowData?.status}</Row>
                      <Row title={"Approval Status"}>{workflowData?.approval_status}</Row>
                      <Row title={"Creation Date"}>{workflowData?.creation_time}</Row>
                      <Row title={"Process Date"}>{workflowData?.process_date}</Row>
                      <tr>
                        <td colSpan={2} >
                          <center>Temporal Settings</center>
                        </td>
                      </tr>
                      <Row title={"Granularity"}>{workflowData?.granularity}</Row>
                      <Row title={"Data Frequency"}>{"Lorem ipsum dolor sit."}</Row>
                      <Row title={"Train Period (in %)"}>{"Lorem ipsum dolor sit."}</Row>
                      <Row title={"Test Period (in %)"}>{"Lorem ipsum dolor sit."}</Row>
                      <Row title={"Forecast frequency"}>{"Lorem ipsum dolor sit."}</Row>
                      <Row title={"Forecast Period"}>{"Lorem ipsum dolor sit."}</Row>                      
                      <tr>
                        <td colSpan={2} >
                          <center>Model Selection</center>
                        </td>
                      </tr>
                      <tr>
                        <td>Models</td>
                        <td>
                          {""}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  )
}

function Row({ title, children }) {
  return (
    <tr>
      <td>{title}</td>
      <td>{children}</td>
    </tr>
  )
}


const Wrapper = styled.div`

.modal {font-family: "Exo"; display: none; overflow: hidden; position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 1050; -webkit-overflow-scrolling: touch; outline: 0;}
.modal-backdrop { position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 1040; background-color: #000; pointer-events: none;}
.modal-backdrop.fade { opacity: 0; filter: alpha(opacity=0);}
.fade {opacity: 0; -webkit-transition: opacity 0.15s linear; -o-transition: opacity 0.15s linear; transition: opacity 0.15s linear;}
.fade.in { opacity: 1;}
.modal-backdrop.in {opacity: 0.5; filter: alpha(opacity=50);}
.modal-open {overflow: hidden;}
.modal-open .modal { overflow-x: hidden; overflow-y: auto; background-color:rgba(0,0,0,0.8) !important; z-index: 99999;}
.modal-dialog { position: relative; width: 50vw !important;}
.modal.fade .modal-dialog {-webkit-transform: translate(0, -25%); -ms-transform: translate(0, -25%); -o-transform: translate(0, -25%); transform: translate(0, -25%); -webkit-transition: -webkit-transform 0.3s ease-out; -moz-transition: -moz-transform 0.3s ease-out; -o-transition: -o-transform 0.3s ease-out; transition: transform 0.3s ease-out;}
.modal .modal-dialog, .in .modal-dialog { -webkit-transform: translate(0, 0); -ms-transform: translate(0, 0); -o-transform: translate(0, 0); transform: translate(0, 0); transition-delay: 0.2s; width:38%; margin-top:8%;}
.modal-content { position: relative;}
.modal-body p {line-height: 28px;}
.modal-header { padding: 5px; height:83px !important;}
.modal-header:before, .modal-header:after, .modal-footer:before, .modal-footer:after { content: " "; display: table;}
.modal-header:after, .modal-footer:after { clear: both;}
.close {float: right; font-size: 21px; font-weight: bold; line-height: 1; color: #000; text-shadow: 0 1px 0 #fff; opacity: 0.2; filter: alpha(opacity=20);}
button.close {padding: 0; cursor: pointer; background: transparent; border: 0; appearance: none; -webkit-appearance: none; font-family: inherit;}
.close:hover, .close:focus { color: #0c3c54 !important; text-decoration: none;  cursor: pointer; opacity: 0.5; filter: alpha(opacity=100);}
.modal-body .close {top: -21px; right: -21px; font-size: 33px; position: absolute; z-index: 99; color: #3d6074 ; opacity: 1;}
.modal-title { margin: 0; line-height: 1.42857143; color: inherit; font-size: 18px; font-weight: normal;}
#driver-terms-modal .modal-body {height: 600px; width:200px; border-radius:5px; overflow: scroll;}
.article{     height: 300px;    overflow-y: scroll;    font-size: 14px !important;    padding: 13px;}
.modal-footer {padding: 15px; text-align: right; border-top: 1px solid #e5e5e5;}
.modal .btn { font-family: inherit; display: inline-block; margin-bottom: 0; font-weight: normal; text-align: center; vertical-align: middle; touch-action: manipulation; cursor: pointer; background-image: none; border: 1px solid transparent; white-space: nowrap; padding: 6px 12px; font-size: 14px; line-height: 1.42857143;  border-radius: 4px; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}
.modal .btn-default {color: #fff; background-color: #1f8234;}
.modal .btn-default:hover {color: #333; background-color: #e6e6e6; border-color: #adadad; text-decoration: none;}
.modal .btn-default:focus {color: #333; background-color: #e6e6e6; border-color: #8c8c8c;}
.modal .btn:active, .modal .btn.active { outline: 0; background-image: none; -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125); box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);}
.modal .btn:focus, .modal .btn:active:focus, .modal .btn.active:focus, .modal .btn.focus, .modal .btn:active.focus, .modal .btn.active.focus { outline: 5px auto -webkit-focus-ring-color; outline-offset: -2px;}
.modal .btn-default:active, .modal .btn-default.active, .modal .open > .dropdown-toggle.btn-default {color: #333; background-color: #e6e6e6; border-color: #adadad;}
.modal .btn-default:active, .modal .btn-default.active, .modal .open > .dropdown-toggle.btn-default {background-image: none;}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* 50% opacity for the fade effect */
  z-index: 99; /* Ensure the overlay appears behind the modal */
}
@media (min-width: 768px) {
    .modal-dialog {
      width: 600px;
      margin: 30px auto;
    }
    .modal-content {
      -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    }
}
`
