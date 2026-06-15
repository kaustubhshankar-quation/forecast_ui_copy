import React from 'react';
import { Link } from 'react-router-dom';

function Breadcrumb({ List }) {
  return (
    <nav className="w-full py-2 px-6 my-1">
      <ol className="flex items-center space-x-4 text-2xl font-bold m-0">
        {List.map((link, index) => (
          <li key={index} className="flex items-center">
            {link.path === "#" ? (
              <span className="text-blue-900 font-extrabold text-3xl">{link.name}</span>
            ) : (
              <Link to={link.path} className="text-blue-600 hover:text-blue-800 transition text-2xl font-semibold">{link.name}</Link>
            )}
            {index < List.length - 1 && (
              <svg className="mx-4 h-8 w-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export default Breadcrumb;