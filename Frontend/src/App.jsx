import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AIChatbot } from "./components/AIChatbot";
import AuthPage from "./components/AuthPage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>

      <AIChatbot />
    </>
  );
}

export default App;