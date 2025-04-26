import SplineModel from "./components/splineModel"
import { BrowserRouter as Router , Routes , Route } from "react-router-dom"
import Compiler from './components/Compiler'
import Home from './pages/landing/Home'
import Signup from "./pages/auth/Signup"
import Login from "./pages/auth/Login"
import ViewAdminRequests from "./pages/auth/ViewAdminRequests"
import About from './pages/landing/About'
import Contact from "./pages/landing/Contact"
import Register from './pages/main/Register'
import Transfer from "./pages/main/transfer"
import ProductDetail from "./pages/main/ProductDetail"


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Compiler/>}>
          <Route path="Home" element={<Home/>}></Route>
          <Route path="signup" element={<Signup/>}></Route>
          <Route path="login" element={<Login/>}></Route>
          <Route path="about" element={<About/>}></Route>
          <Route path="contact" element={<Contact/>}></Route>
          <Route path="view-requests" element={<ViewAdminRequests/>}></Route>
        </Route>
          <Route path="register" element={<Register/>}></Route>
          <Route path="transfer-ownership" element = {<Transfer/>} ></Route>
          <Route path="product-detail" element = {<ProductDetail/>} ></Route>
      </Routes>
    </Router>
  )
}

export default App
