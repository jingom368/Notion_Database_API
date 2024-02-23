import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Notion from './Notion';
import EssayNotion from './EssayNotion';
import ArtFirstEssayNotion from './ArtFirstEssayNotion';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/notion" element={<Notion />} />
        <Route path="/essaynotion" element={<EssayNotion />} />
        <Route path="/ArtFirstEssay" element={<ArtFirstEssayNotion />} />
      </Routes>
    </Router>
  );
}

export default App;