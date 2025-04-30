
import { FileCode } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileCode className="h-8 w-8 text-modelhub-primary" />
          <div className="ml-3">
            <h1 className="text-2xl font-bold text-modelhub-text-primary">ModelHub</h1>
            <p className="text-sm text-modelhub-text-secondary">Model Lifecycle Governance</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
