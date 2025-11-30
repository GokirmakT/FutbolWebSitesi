import { Route, Routes } from "react-router-dom";
import Header from "./Components/Header.jsx";
import Home from "./Home.jsx";
import Card from "./Pages/Card.jsx";
import Corners from "./Pages/Corners.jsx";
import Goal from "./Pages/Goal.jsx";

export default function App() {
  return (
    <>
      <Header/> {/* Her sayfada görünsün diye buraya ekle */}
      <Routes>
        <Route path="/" element={<Home />} />   
        <Route path="/Cards" element={<Card />} />   
        <Route path="/Corners" element={<Corners />} />
        <Route path="/Goals" element={<Goal />} />
      </Routes>
    </>
  );
}
