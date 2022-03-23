import { ReactElement } from 'react';

export type TToggleFilter = {
  filterType: string;
  isLoading: boolean;
  setFilterType: (filter: string) => void;
  text: string;
};

export const ToggleFilter = ({
  filterType,
  isLoading,
  setFilterType,
  text,
}: TToggleFilter): ReactElement => {
  return (
    <button
      className={`mr-6 ${filterType === text ? 'text-slate-800 underline' : 'text-slate-600'}`}
      data-trackid="toggle-filter-all"
      disabled={isLoading}
      onClick={(): void => setFilterType(text)}
    >
      {text}
    </button>
  );
};
