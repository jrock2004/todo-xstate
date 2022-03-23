import { ReactElement } from 'react';

import { Todos } from './components/Todos';

const App = (): ReactElement => {
  return (
    <div className="flex flex-col justify-center items-center mt-12">
      <h1 className="text-7xl text-red-800 font-normal">todos</h1>
      <Todos />
    </div>
  );
};

export default App;
