import React, { createRef, useRef } from 'react';
import '../../assets/css/css.css';
import * as images from '../../assets/images';
import AuthService from '../../services/AuthService';
import { displayMessage } from '../../Utils/helper';
import styled from 'styled-components';
import loginbg from '../../assets/images/loginbg.webp';

//../images/loginbg.webp
export default function LoginPopup({ onClose, gotoSignUp }) {

  const usernameRef = useRef();
  const passwordRef = createRef();
  const agreementRef = useRef();



  const submitLogin = async () => {
    try {
      //console.log(`${agreementRef.current.checked} value`)
      if (agreementRef.current.checked) {
        let result = await AuthService.login({ username: usernameRef.current.value, password: passwordRef.current.value });
        console.log(result);
        //displayMessage('success', 'Logged in Successfully', 'Logged in Successfully');
      }
      else {
        displayMessage('danger', 'Please accept Agreement', 'Terms and Conditions');
      }

    } catch (error) {
      console.log(error);
      displayMessage('danger', 'Error', error);
    }
  }

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
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div className="loginwhitebg">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                      <div className="loginiconbg">
                        <img src={images.loginicon1} className="max" alt="Demand Edge" />

                        <span>Login</span>
                      </div>
                    </div>
                    <div className="col-md-12 col-sm-12 col-xs-12">
                      <div className="form-group1">
                        <input ref={usernameRef} type="text" className="form-control form-control1" id="username" placeholder="User Name" />
                      </div>
                      <div className="form-group1">
                        <input ref={passwordRef} type="password" className="form-control form-control1" id="password" placeholder="Password" />
                      </div>
                      <div className="forgotpwd">
                        <a href="#" aria-label="DE">Forgot Password?</a>
                      </div>
                      <div className="form-group">
                        <div className="checkbox">
                          <label><input ref={agreementRef} type="checkbox" id="agreement" />I agree to the Terms of Service and Privacy Policy.</label>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="connectbtn">
                          <a onClick={submitLogin} href='#' aria-label="DE">Login <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>


                      </div>
                      <div className="noaccount">
                        <a href="#" aria-label="DE">Don’t Have An Account?</a>
                      </div>
                      <div className="createaccount">
                        <a onClick={gotoSignUp} className='open-signup' aria-label="DE">Create Account Now</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>

  )
}


const Wrapper = styled.div`
.loginwhitebg{background-color: rgba(255, 255, 255, 0.9); text-align: center; margin-top: 7%; width: 96%; margin-left: 33%; float: left; padding-left: 30px; padding-right: 30px; padding-bottom: 30px;}
.loginwhitebg1{padding: 0px 0px 30px 0px !important;}
.loginiconbg{
  background-color: #AC1424; margin-top: -10%;
  border-radius: 100px;
  width: 120px;
  height: 120px;
  margin: -13% auto 0px auto;
  text-align: center;
  padding: 1px 0px 0px 0px; color: #fff;
  font-size: 17px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.loginiconbg img{width: 68%;}
.loginiconbg span{margin-bottom:10px;}
.form-control1{ border: 1px solid #0C3C54 !important; height: 60px !important;}
.form-control1::placeholder{color: #444444 !important; font-weight: 400 !important;}
.forgotpwd{text-align: right; font-size: 13px; color: #AC1424; margin-top: -5px; font-weight: 600;}
.forgotpwd a{color: #AC1424;}
.loginwhitebg .checkbox label{color: #0C3C54;}
.noaccount{text-align: center; font-size: 14px; color: #AC1424; margin-top: 35px; font-weight: 400;}
.noaccount a{color: #AC1424;}
.createaccount{text-align: center; font-size: 22px; color: #0C3C54; margin-top: 10px; font-weight: 400;}
.createaccount a{color: #0C3C54;}

.modal {font-family: "Exo"; display: none; overflow: hidden; position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 1050; -webkit-overflow-scrolling: touch; outline: 0;}
.modal-backdrop { position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 1040; background-color: #000; pointer-events: none;}
.modal-backdrop.fade { opacity: 0; filter: alpha(opacity=0);}
.fade {opacity: 0; -webkit-transition: opacity 0.15s linear; -o-transition: opacity 0.15s linear; transition: opacity 0.15s linear;}
.fade.in { opacity: 1;}
.modal-backdrop.in {opacity: 0.5; filter: alpha(opacity=50);}
.modal-open {overflow: hidden;}
.modal-open .modal { overflow-x: hidden; overflow-y: auto; background-color:rgba(0,0,0,0.8) !important; z-index: 99999;}
.modal-dialog { position: relative; width: auto;}
.modal.fade .modal-dialog {-webkit-transform: translate(0, -25%); -ms-transform: translate(0, -25%); -o-transform: translate(0, -25%); transform: translate(0, -25%); -webkit-transition: -webkit-transform 0.3s ease-out; -moz-transition: -moz-transform 0.3s ease-out; -o-transition: -o-transform 0.3s ease-out; transition: transform 0.3s ease-out;}
.modal .modal-dialog, .in .modal-dialog { -webkit-transform: translate(0, 0); -ms-transform: translate(0, 0); -o-transform: translate(0, 0); transform: translate(0, 0); transition-delay: 0.2s; width:38%; margin-top:8%;}
.modal-content { position: relative;}
.modal-body p {line-height: 28px;}
.modal-header { padding: 5px; height:83px !important;}
.modal-header:before, .modal-header:after, .modal-footer:before, .modal-footer:after { content: " "; display: table;}
.modal-header:after, .modal-footer:after { clear: both;}
.close {float: right; font-size: 21px; font-weight: bold; line-height: 1; color: #000; text-shadow: 0 1px 0 #fff; opacity: 0.2; filter: alpha(opacity=20);}
button.close {padding: 0; cursor: pointer; background: transparent; border: 0; appearance: none; -webkit-appearance: none; font-family: inherit;}
.close:hover, .close:focus { color: #fff !important; text-decoration: none;  cursor: pointer; opacity: 0.5; filter: alpha(opacity=100);}
.modal-body .close {top: -25px; right: -30px; font-size: 33px; position: absolute; z-index: 99; color: #fff; opacity: 1;}
.modal-title { margin: 0; line-height: 1.42857143; color: inherit; font-size: 18px; font-weight: normal;}
.modal-body { position: relative; width:100%; float:left; text-align: center; background-image: url(${loginbg}); background-repeat: no-repeat;  height: 550px; border-radius: 30px 0px 30px 0px;}
#driver-terms-modal .modal-body {height: 600px; overflow: scroll;}
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
