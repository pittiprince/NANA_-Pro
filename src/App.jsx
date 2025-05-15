import { LandingPage } from "./assets/components/LandingPage"
import { ErrorPage } from "./assets/components/ErrorPage";
import './app.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {KonvaCanva } from './assets/components/KonvaCanvas'
import { LoginPage } from "./assets/components/LoginPage";
import { SignupPage } from "./assets/components/SignupPage";
function App() {
  return (
<BrowserRouter>
<Routes>
  <Route path="/" element={<LandingPage></LandingPage>}  />
  <Route path="/canvas" element={<KonvaCanva></KonvaCanva>} />
  <Route path="/loginPage" element={<LoginPage></LoginPage>}/>
  <Route path="/signupPage" element={<SignupPage></SignupPage>} />
  <Route path="*" element={<ErrorPage></ErrorPage>}/>
</Routes>
</BrowserRouter>
  )
}

export default App
