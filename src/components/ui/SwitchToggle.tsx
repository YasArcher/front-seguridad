import type { FC } from "react";
import type { SwitchToggleProps } from "./types/SwitchToggleProps";
const SwitchToggle: FC<SwitchToggleProps> = ({ label, icon, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        {icon && <span className="text-gray-600">{icon}</span>}
        <span className="font-medium text-gray-800">{label}</span>
      </label>
      
      <button
        type="button"
        className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          checked ? "bg-blue-600" : "bg-gray-300"
        }`}
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
      >
        <span className="sr-only">{checked ? "Enable" : "Disable"} {label}</span>
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        ></div>
      </button>
    </div>
  );
};

export default SwitchToggle;