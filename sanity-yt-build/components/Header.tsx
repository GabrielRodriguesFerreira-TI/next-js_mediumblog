import Image from "next/image";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <Image
            width={200}
            height={40}
            className="object-contain cursos-pointer"
            src="/Kenzium Logo.svg"
            alt="Medium Logo"
            priority
          />
        </Link>
        <div className="teste hidden md:inline-flex items-center space-x-5">
          <h3 className="cursor-pointer">Sobre</h3>
          <h3 className="cursor-pointer">Contato</h3>
          <h3 className="cursor-pointer text-white bg-green-600 px-4 py-1 rounded-full">
            Follow
          </h3>
        </div>
      </div>

      <div className="flex items-center space-x-5 text-green-600">
        <h3 className="cursor-pointer">Sing In</h3>
        <h3 className="cursor-pointer border px-4 py-1 rounded-full  border-green-600">
          Get Started
        </h3>
        <h3></h3>
      </div>
    </header>
  );
}

export default Header;
