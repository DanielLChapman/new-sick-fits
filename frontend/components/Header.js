import Link from 'next/link';
import Nav from './Nav';

export default function Header() {
  return (
    <div>
      <div className="bar">
        <Link href="/">Logo</Link>
      </div>
      <div className="sub-bar">
        <p>search</p>
      </div>
      <Nav />
    </div>
  );
}
