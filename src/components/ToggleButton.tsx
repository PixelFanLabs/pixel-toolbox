import React from 'react';
import { Switch } from '@headlessui/react';
import { Info } from 'lucide-react';

interface ToggleButtonProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string; // Add id prop
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, description, checked, onChange, id }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <label htmlFor={id} className="text-base font-medium text-slate-800 cursor-pointer">
          {label}
        </label>
        <div className="relative group">
          <Info className="w-4 h-4 text-slate-500 cursor-pointer" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {description}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
          </div>
        </div>
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        className={`${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 items-center`}
        id={id} // Bind id to the Switch component
      >
        <span className="sr-only">{label}</span>
        <span
          className={`${
            checked ? 'translate-x-5' : 'translate-x-1'
          } block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
    </div>
  );
};

export default ToggleButton;