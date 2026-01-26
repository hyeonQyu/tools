import BudgetingPage from '@/pages/budgeting/BudgetingPage';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/budgeting" element={<BudgetingPage />} />
    </Routes>
  );
}

export default App;
