import Link from 'next/link';
function LogoLink() {
  return (
    <div className="mb-4 text-center sm:mb-0">
      <Link href="/">
        {/* Your logo component */}
      </Link>
    </div>
  );
}
export default LogoLink; 