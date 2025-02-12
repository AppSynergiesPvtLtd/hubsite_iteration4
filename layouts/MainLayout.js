'use client'; 
import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';
import React from 'react';


const MainLayout = ({ children }) => {
  return (
    <div>
     <Navbar/>
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
