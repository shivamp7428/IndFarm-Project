import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AIChatbot } from "./components/AIChatbot";
import AuthPage from "./components/AuthPage";
import Home from "./page/Home";
import Footer from "./components/Footer";
import Detail from "./page/Detail";
import ScrollToTop from "./components/ScrollToTop";
import FarmerProfile from "./page/FarmerProfile";

function App() {
  return (
    <>
     <ScrollToTop/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/detail/:id" element={<Detail/>}/>
        <Route path="/farmer-profile/:id" element={<FarmerProfile/>} />
      </Routes>
       
      <AIChatbot />
      <Footer/>
    </>
  );
}

export default App;