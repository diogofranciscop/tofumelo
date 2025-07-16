import Link from 'next/link';
import Image from 'next/image';

function Burguer({onClick}: {onClick: () => void}) {
  return (
    <div className="text-center sm:mb-0">
      <button onClick={onClick}>
        <Image 
        src="/burguer-menu.svg" 
        alt="Burguer Menu" 
        width={48}  
        height={48} 
        className='brightness-0 invert'
        />
      </button>
    </div>
  );
}
export default Burguer; 