import LoginTrigger from './login-trigger';
import NavItems from './nav-items';

export default function Navbar() {
  return (
    <div className="mb-16">
      <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <NavItems>
          <LoginTrigger />
        </NavItems>
      </header>
    </div>
  );
}
