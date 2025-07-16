import Link from 'next/link';
import Image from 'next/image';
import Title from './Title';

interface LogoProps{
  className?:string;
}

function Logo({className= ''}: LogoProps) {
  return (
    <div className="text-center sm:mb-0 ">
      <Link href="/" className={`flex flex-row ${className}`}>
        <Image 
        src="/LOGO.png" 
        alt="Logo Tofumelo" 
        width={48}  
        height={48} 
        />
        <Title/>
      </Link>
    </div>
  );
}
export default Logo; 