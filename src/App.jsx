import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginRegister/Login/Login';
import Register from './pages/LoginRegister/Register/Register';
import Home from './pages/Home/Home';
import ShopPage from './pages/ShopPage/ShopPage';
import PrivateRoute from './PrivateRoute';
import ShoppingList from './pages/ShoppingList/shoppingList';


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/homePage" element={<Home />} />
                <Route
                    path="/shopPage"
                    element={
                    <PrivateRoute>
                        <ShopPage />
                    </PrivateRoute>
                    }
                />
                <Route path="/shopping-list" element={<ShoppingList />} />
            </Routes>
        </BrowserRouter>
    )
}