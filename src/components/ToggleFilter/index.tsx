import { ReactElement } from 'react';

export type TToggleFilter = {
  filterType: string;
  isLoading: boolean;
  text: string;
};

export const ToggleFilter = ({ filterType, isLoading, text }: TToggleFilter): ReactElement => {
  return (
    <button
      className={`mr-6 ${filterType === text ? 'text-slate-800' : 'text-slate-600'}`}
      data-trackid="toggle-filter-all"
      disabled={isLoading}
    >
      {text}
    </button>
  );
};
