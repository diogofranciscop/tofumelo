import React from 'react';

const ResponsiveLayout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen ">
      {/* Navbar / Sidebar */}
      <nav className="bg-gray-200 p-4 flex md:flex-col md:w-64 w-full border-t-[10px] border-b-[10px] border-l-[10px]">
        <a href="#" className="md:mb-4 mr-4 md:mr-0 hover:underline">Home</a>
        <a href="#" className="md:mb-4 mr-4 md:mr-0 hover:underline">Recipes</a>
        <a href="#" className="md:mb-4 mr-4 md:mr-0 hover:underline">About</a>
      </nav>

     
    </div>
  );
};

export default ResponsiveLayout;
