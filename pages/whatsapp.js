import React from 'react';

const Whatsapp = () => {
  return (
    <div className="fixed bottom-24 right-4 z-50">
      <a
        href="https://wa.me/yourphonenumber"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp Logo"
          className="w-full h-full p-5 "
        />
      </a>
    </div>
  );
};

export default Whatsapp;
