import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginRegister/Login/Login';
import Register from './pages/LoginRegister/Register/Register';
import Home from './pages/Home/Home';


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/homePage" element={<Home />} />
            </Routes>
        </BrowserRouter>
    )
}