import type { FC } from "react";
import type { InfoBlockProps } from "./types/InfoBlockProps";

const InfoBlock: FC<InfoBlockProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="text-xs text-gray-500 font-medium mb-1">
        {title}
      </div>
      <div className="flex items-center">
        {icon}
        <span className="text-gray-700">{value}</span>
      </div>
    </div>
  );
};

export default InfoBlock