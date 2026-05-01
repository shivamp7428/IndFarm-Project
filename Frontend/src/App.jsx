import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AIChatbot } from "./components/AIChatbot";

import AuthPage from "./components/AuthPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
      <AIChatbot />
    </Router>
  );
}

export default App;