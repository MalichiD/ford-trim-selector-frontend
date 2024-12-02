import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/clerk-react';
import { House } from 'lucide-react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
  return (
    <header>
      <div className="header-content">
      <Link to="/">
          <House className='home-button' size={64}/>
        </Link>
        
        <span className="header-title">
          <img className='header-image' src="//www.ford.com/etc/designs/brand_ford/brand/skin/ford/img/bri-icons/Ford-logo.svg" alt="Ford Logo" />
        </span>

        <SignedOut>
          <SignInButton>
            <button className="sign-in-button">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className='user-button'>
          <UserButton appearance={{
            elements: {
              formButtonPrimary: {
                width: '100px',
                height: '100px',
              },
              userButtonAvatarBox: {
                width: '75px',
                height: '75px',
              }
            }
          }}/>
          </div>
        </SignedIn>

        <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css"/>
        <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
      </div>
    </header>
  );
};

export default Header;