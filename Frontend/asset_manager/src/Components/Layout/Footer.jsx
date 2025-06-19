// src/components/layout/Footer.jsx
import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-300  py-6 px-6 text-sm text-gray-700">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and Intro */}
        <div className="flex flex-col items-start gap-3">
          <img src="../../public/haldyn_logo.jpg" alt="Haldyn Glass Logo" className="h-10 object-contain" />
          <p className="text-gray-600">
            <strong>Haldyn Glass Ltd</strong> 
          </p>
        </div>

        {/* Contact (Mumbai) */}
        <div>
          <h3 className="font-semibold text-blue-700">Corporate Office</h3>
          <p>B-1201, Lotus Corporate Park,<br />
            Off. Western Express Highway,<br />
            Goregaon (East), Mumbai – 400063<br />
            Maharashtra, India.</p>
          <p><strong>Tel:</strong> +91 22 42878999</p>
          <p><strong>Fax:</strong> +91 22 42878910</p>
          <p><strong>Email:</strong> info@haldyn.com, bombay@haldyn.com</p>
        </div>

        {/* Contact (Vadodara) */}
        <div>
          <h3 className="font-semibold text-blue-700">Registered Office & Works</h3>
          <p>Village Gavasad, Taluka Padra,<br />
            Dist. Vadodara – 391430<br />
            Gujarat, India.</p>
          <p><strong>Tel:</strong> +91 2662 242339</p>
          <p><strong>Fax:</strong> +91 2662 245081</p>
          <p><strong>Email:</strong> baroda@haldyn.com</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-6 text-xs text-gray-500">
        © {new Date().getFullYear()} Haldyn Glass Ltd. All rights reserved.
      </div>
    </footer>
  );
};

