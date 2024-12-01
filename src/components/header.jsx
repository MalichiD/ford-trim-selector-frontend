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
        
        <span className="header-title">
          <img style={{ textAlign: 'center', width: '105px', height: '53px' }} src="//www.ford.com/etc/designs/brand_ford/brand/skin/ford/img/bri-icons/Ford-logo.svg" alt="Ford Logo" />
        </span>

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