import type { FC } from 'react';
import type { ContentContainerProps } from './types/ContentContainerProps';

const ContentContainer: FC<ContentContainerProps> = ({ children }) => {
  return (
    <div className="flex-1 px-4 pb-6 overflow-hidden">
      <div className="bg-white rounded-xl shadow p-6">
        {children}
      </div>
    </div>
  );
};


export default ContentContainer;