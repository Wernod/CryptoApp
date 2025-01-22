import {Route,BrowserRouter as  Router, Routes} from "react-router-dom";
import Home from './App.jsx'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import Review from "./pages/review.jsx";
import AboutCoin from './pages/aboutCoin.jsx'
import PrivateRoute from "./privateRoute.jsx";


function AppRouter() {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<PrivateRoute/>}>
                    <Route path="/review" element={<Review/>} />
                    <Route path="/review/:id" element={<AboutCoin/>} />
                </Route>
            </Routes>
        </Router>
    )
}
export default AppRouter;