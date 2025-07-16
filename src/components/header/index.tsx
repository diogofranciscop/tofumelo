"use client";
import React, { useState } from 'react';
import Logo from './Logo';
import Burguer from './Burguer';
import { Playfair_Display } from 'next/font/google'
import ButtonHeader from './Button-links';
import { motion, AnimatePresence } from "framer-motion";

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleHeader() {
    setIsOpen((prev) => !prev);
  }

  return (
    <div>
      {/* Desktop */}
      <div className="hidden relative py-6 sm:flex flex-col justify-center">
        <Logo />
      </div>

      {/* Mobile */}
      <div className="sm:hidden mx-7">
        {!isOpen ? (
          // Compact mobile header
          <div className="relative flex flex-row my-4 bg-[#8CA572] w-full rounded-3xl items-center justify-between px-4 py-1.5">
            <Logo />
            <Burguer onClick={toggleHeader} />
          </div>
        ) : (
          // Expanded menu with transition
          <div
            className={`
              relative flex flex-col my-4 bg-[#8CA572] max-h-screen 
              rounded-3xl w-fit ml-auto px-4 py-2
              transition-all duration-300 ease-in-out
            `}
          >
            <div className="flex flex-row items-center px-4 py-1.5 justify-end">
              <Logo className="mr-4" />
              <Burguer onClick={toggleHeader} />
            </div>
            <div className="flex flex-col items-center">
              <ButtonHeader path="/" name="RECEITAS" />
              <ButtonHeader path="/" name="SOBRE" />
              <ButtonHeader path="/" name="CRÉDITOS" />
              <ButtonHeader path="/" name="ENVIA A TUA RECEITA" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
