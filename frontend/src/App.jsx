import SplineModel from "./components/splineModel"
import { BrowserRouter as Router , Routes , Route, Navigate, Outlet } from "react-router-dom"
import Compiler from './components/Compiler'
import Home from './pages/landing/Home'
import Signup from "./pages/auth/Signup"
import Login from "./pages/auth/Login"
import ViewAdminRequests from "./pages/auth/ViewAdminRequests"
import About from './pages/landing/About'
import Contact from "./pages/landing/Contact"
import Register from './pages/main/Register'
import Transfer from "./pages/main/CreateTransfer"
import ProductDetail from "./pages/main/ProductDetail"
import CreateProductEvent from "./pages/main/CreateProductEvent"
import ApproveTransfer from "./pages/main/ApproveTransfer"
import UserProducts from "./pages/main/UserProducts"
import UserLayout from './layouts/UserLayout';
import Dashboard from './pages/dashboard/dashboard';
import ProductDetailsPub from "./pages/main/ProductDetailPub"
import UserProfile from "./pages/landing/UserProfile"


const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

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
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/approve-transfers" element={<ApproveTransfer />} />
            <Route path="/user-products" element={<UserProducts />} />
            <Route path="/register-product" element={<Register />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/create-event" element={<CreateProductEvent />} />
            <Route path="/create-transfer" element={<Transfer />} />
            <Route path="/approve-transfer" element={<ApproveTransfer />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Route>
        <Route path="/verify/:id" element={<ProductDetailsPub/>}></Route>
      </Routes>
    </Router>
  )
}

export default App
