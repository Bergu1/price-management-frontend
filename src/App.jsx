import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginRegister/Login/Login';
import Register from './pages/LoginRegister/Register/Register';


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    )
}