import React from 'react';
import Image from 'next/image';

const Whatsapp = () => {
  return (
    <div className="fixed bottom-2 right-2 z-50 opacity-1  p-3 rounded-full bg-white">
      <a
        href="https://wa.me/+919971636521"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-14 h-14 bg-green-500 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
      >
        <div className="relative w-full h-full">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp Logo"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
      </a>
    </div>
  );
};

export default Whatsapp;
