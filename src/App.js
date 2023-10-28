import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import FormComponent from "./FormComponent";

function App() {
  return (
    <div className="App">

<BrowserRouter>
       <Routes>
       {/* <Route path="/" element={<SignUp/>} /> */}
       <Route path="/:id" element={<FormComponent/>} />
            </Routes>
            </BrowserRouter>
    </div> 
  );
}

export default App;
