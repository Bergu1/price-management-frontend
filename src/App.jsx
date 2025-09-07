import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginRegister/Login/Login';
import Register from './pages/LoginRegister/Register/Register';
import Home from './pages/Home/Home';
import ShopPage from './pages/ShopPage/ShopPage';

import ShoppingList from './pages/ShoppingList/shoppingList';
import Panel from "./pages/Panel";

import AddProduct from "./pages/Panel/components/AddProduct";

import PrivateRoute from './routes/PrivateRoute';
import PrivateEmployeeRoute from "./routes/PrivateEmployeeRoute";


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

                <Route 
                    path="/shopping-list" 
                    element={
                    <PrivateRoute>
                        <ShoppingList />
                    </PrivateRoute>
                    }
                />

                <Route
                    path="/panel"
                    element={
                        <PrivateEmployeeRoute>
                        <Panel />
                        </PrivateEmployeeRoute>
                    }
                />
                <Route
                    path="/panel/add"
                    element={
                    <PrivateEmployeeRoute>
                        <AddProduct />
                    </PrivateEmployeeRoute>
                    }
                />
            </Routes>

        </BrowserRouter>
    )
}