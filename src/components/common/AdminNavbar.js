import React, { useState, useEffect } from 'react';
import * as Image from '../../assets/images';
import '../../assets/css/afterloginmenu.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { getCookie } from '../../services/DataRequestService';


export default function AdminNavbar() {
  // State to track the active link
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {

    // Array of script sources
    const scripts = [
      'js/jquery.min.js',  
      'js/menu2.js'
    ];

    // Function to load a script
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(src);
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };

    // Load all scripts in order
    const loadScriptsSequentially = async () => {
      try {
        for (const script of scripts) {
          await loadScript(script);
        }
        //console.log('All scripts loaded successfully.');
      } catch (error) {
        console.error(error);
      }
    };

    loadScriptsSequentially();

    // Cleanup function to remove scripts on component unmount
    return () => {
      scripts.forEach((src) => {
        const script = document.querySelector(`script[src="${src}"]`);
        if (script) {
          document.body.removeChild(script);
        }
      });
    };
  }, []);


  // Array of link objects to avoid repetition
  const links = [
    // { to: '/Dashboard', name: 'Dashboard', state: { pageName: 'Dashboard' } },
    // { to: '/CreateWorkflow', name: 'Create Workflow', state: { pageName: 'Create Workflow' } },
    // { to: '/ManageWorkflow', name: 'Manage Workflow', state: { pageName: 'Manage Workflow' } },
    // { to: '/MyProfile', name: 'My Profile', state: { pageName: 'My Profile' } },
  ];

  const doLogout = () => {
    AuthService.logout();
  }


  return (
    <div className="container-fluid afterloginnewheader afterloginhead">
      <div className="row">
        <div className="col-md-2 col-sm-4 col-xs-6">
          <div className="afterloginlogo">
            <a href="/" aria-label="DE"><img src={Image.afterloginlogo} className="max" alt="Demand Edge" /></a>
          </div>
        </div>
        <div className="col-md-7 col-sm-8 col-xs-2">
          <div className="inmainmenu">
            <nav id="innav">
              <ul className="clearfix">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      state={link.state}
                      onClick={() => setActiveLink(link.name)}
                      className={activeLink === link.name ? 'active-link' : ''}
                      aria-label="DE"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div className="col-md-1 col-sm-2 col-xs-2">
          <div className="bellicon">
            <a href="#"><iconify-icon icon="mdi:bell"></iconify-icon></a>
          </div>
        </div>
        <div className="col-md-2 col-sm-4 col-xs-12">
          <div className="welcomemenu">
            <ul>
              <li>Welcome To Demand Edge<a href="#">{ getCookie('username')?.toUpperCase() } 
              <div className="tooltipa" onClick={doLogout}>
                 <iconify-icon icon="ant-design:logout-outlined"> 

                 </iconify-icon>
                 <span className="tooltiptext">logout</span>
                 </div>
                 </a>
                {/* <ul>
                  <li><a onClick={doLogout}  >Logout</a></li>
                </ul> */}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
