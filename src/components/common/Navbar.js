import React, { useState, useEffect } from 'react';
import * as Image from '../../assets/images';
import '../../assets/css/afterloginmenu.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { getCookie } from '../../services/DataRequestService';
import styled from "styled-components"
 
export default function Navbar() {
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
    { to: '/Dashboard', name: 'Dashboard', state: { pageName: 'Dashboard' } },
    { to: '/CreateWorkflow', name: 'Create Workflow', state: { pageName: 'Create Workflow' } },
    { to: '/ManageWorkflow', name: 'Forecast Library', state: { pageName: 'Forecast Library' } },
    { to: '/comparison', name: 'Collaboration Portal', state: { pageName: 'Collaboration Portal' } },
    { to: '/indentation', name: 'Inventory Optimization', state: { pageName: 'Inventory Optimization' } },
    // { to: '/MyProfile', name: 'My Profile', state: { pageName: 'My Profile' } },
    {
      to: '#', name: 'Configuration', state: { pageName: 'Configuration' }, children: [
        { to: '/sales-person', name: 'Sales Person', state: { pageName: 'Sales Person List' } },
        { to: '/sales-person-sku-mapping', name: 'Sales Person Sku Mapping', state: { pageName: 'Sales Person' } },
      ]
    },
  ];
 
  const doLogout = () => {
    AuthService.logout();
  }
 
 
  return (
    <div className="container-fluid afterloginnewheader afterloginhead">
      <div className="row" style={{ display: 'flex', alignItems: 'center', minHeight: '80px', justifyContent: 'flex-start' }}>
        <div className="col-md-2 col-sm-4 col-xs-6">
          <div className="afterloginlogo">
            <a href="/" aria-label="DE"><img src={Image.afterloginlogo} className="max" alt="Demand Edge" /></a>
          </div>
        </div>
        <div className="col-md-7 col-sm-8 col-xs-2" style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'flex-start', marginLeft: '0px' }}>
          <div className="navbar-navbox" style={{ marginTop: '0', marginBottom: '0', marginLeft: '0', marginRight: '0', paddingTop: '0', paddingBottom: '0' }}>
            <NavigationElement id="innav">
              <ul className="menu">
                {links.map((link) => (
                  <li key={link.name}>
                    <div className="nav-link-box">
                      <Link
                        to={link.to}
                        state={link.state}
                        onClick={() => setActiveLink(link.name)}
                        className={activeLink === link.name ? 'active-link' : ''}
                        aria-label="DE"
                      >
                        {link.name}
                      </Link>
                    </div>
                    {link.children?.length > 0 &&  <ul> {link.children?.map(elem =>
                      <li>
                        <div className="nav-link-box">
                          <Link
                            to={elem.to}
                            state={elem.state}
                            onClick={() => setActiveLink(elem.name)}
                            className={activeLink === elem.name ? 'active-link' : ''}
                            aria-label="DE"
                          >
                            {elem.name}
                          </Link>
                        </div>
                      </li>
                    )}
                    </ul>
                    }
                  </li>
                ))}
              </ul>
            </NavigationElement>
          </div>
        </div>
        <div className="col-md-1 col-sm-2 col-xs-2">
        </div>
        <div className="col-md-2 col-sm-4 col-xs-12">
          <div className="welcomemenu" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%' }}>
            <ul style={{ margin: 5, padding: 0 }}>
              <li>
                  <a href="#" style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#093b59', position: 'relative', top: '-12px', left: '-20px', letterSpacing: '2px' }}>
                  {getCookie('username')?.toUpperCase()}
                  <div className="tooltipa" onClick={doLogout} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                    <iconify-icon icon="ant-design:logout-outlined"></iconify-icon>
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
 
const NavigationElement = styled.nav`
  .navbar-navbox {
    background: #032B4E;
    border: 3px solid #032B4E;
    border-radius: 18px;
    box-shadow: 0 10px 40px 0 rgba(3,43,78,0.22), 0 2px 8px rgba(3,43,78,0.14);
    padding: 6px 16px;
    margin: 0 0 0 4px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: auto;
    max-width: 700px;
    position: static;
    transition: box-shadow 0.3s;
  }
  ul.menu {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 38px;
    font-family: 'Poppins', sans-serif !important;
    gap: 12px;
    margin: 0;
    padding: 0;
    margin-top: 0;
    margin-left: 0;
    white-space: nowrap;
    li {
      position: relative;
      padding: 0;
      height: 100%;
      font-family: 'Poppins', sans-serif !important;
      .nav-link-box {
        border: 2px solid #032B4E;
        border-radius: 14px;
        background: #032B4E;
        box-shadow: 0 3px 12px rgba(3,43,78,0.12), 0 1px 4px rgba(3,43,78,0.08);
        padding: 6px 16px;
        margin: 0 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: box-shadow 0.2s, background 0.2s;
        a {
          font-family: 'Poppins', sans-serif !important;
          font-size: 14px;
          color: #fff;
          font-weight: 600;
          letter-spacing: 0.5px;
          background: none;
          border: none;
          display: inline-block;
          padding: 0 2px;
          line-height: 1.2;
          text-shadow: 0 2px 8px rgba(3,43,78,0.10);
        }
        a.active-link {
          color: #ffe082;
          text-decoration: underline;
        }
        a:hover {
          color: #ffe082;
        }
      }
      ul {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        min-width: 180px;
        background: #032B4E;
        box-shadow: 0 2px 8px rgba(3,43,78,0.10);
        border-radius: 10px;
        padding: 4px 0;
        z-index: 100;
        font-family: 'Poppins', sans-serif !important;
        li {
          display: block;
          padding: 4px 10px;
          font-family: 'Poppins', sans-serif !important;
          .nav-link-box {
            border: 2px solid #032B4E;
            border-radius: 8px;
            background: #032B4E;
            box-shadow: 0 1px 4px rgba(3,43,78,0.08);
            padding: 2px 8px;
            margin: 1px 0;
            a {
              font-family: 'Poppins', sans-serif !important;
              font-size: 13px;
              color: #fff;
              font-weight: 500;
              background: none;
              border: none;
              transition: color 0.2s;
              padding: 0;
            }
            a.active-link {
              color: #ffe082;
              text-decoration: underline;
            }
            a:hover {
              color: #ffe082;
            }
          }
        }
      }
      &:hover > ul, ul:hover {
        display: block;
        visibility: visible;
      }
    }
  }
`