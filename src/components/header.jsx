import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/clerk-react';
import { House } from 'lucide-react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
  return (
    <header>
      <div className="header-content">
      <Link to="/">
          <House className='home-button' />
        </Link>
        
        <span className="header-title">Trim Level Selector: Ford</span>

        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>

        <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css"/>
        <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
      </div>
    </header>
  );
};

export default Header;