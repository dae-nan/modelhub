
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-modelhub-primary">ModelHub</Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-modelhub-primary px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/data-manager" className="text-gray-600 hover:text-modelhub-primary px-3 py-2 rounded-md text-sm font-medium">
              Data Manager
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
