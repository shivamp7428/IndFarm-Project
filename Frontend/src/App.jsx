import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AIChatbot } from "./components/AIChatbot";
import AuthPage from "./components/AuthPage";
import Home from "./page/Home";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
       
      <AIChatbot />
      <Footer/>
    </>
  );
}

export default App;