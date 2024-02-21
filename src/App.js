import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Notion from './Notion';
import EssayNotion from './EssayNotion';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/notion" element={<Notion />} />
        <Route path="/essaynotion" element={<EssayNotion />} />
      </Routes>
    </Router>
  );
}

export default App;