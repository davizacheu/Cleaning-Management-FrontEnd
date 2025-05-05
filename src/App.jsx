// src/App.jsx
import {Routes, Route} from 'react-router-dom';
import './App.css';
import Header from './component/Header/Header.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import UserDashboard from './pages/UserDashboard/UserDashboard.jsx';
import RolePage from './pages/RolePage/RolePage.jsx';
import Footer from "./component/Footer/Footer.jsx";
import ProtectedLayout from "./pages/ProtectedLayout.jsx";

function App() {
    console.log("Rendering App");

    return (
        <div className="app-container">
            <Header/>

            <Routes>
                <Route path="/" element={<HomePage/>}/>

                {/* Protected routes group */}
                <Route element={<ProtectedLayout />}>
                    <Route path="/dashboard" element={<UserDashboard/>}/>
                    <Route path="/role/:roleId" element={<RolePage/>}/>
                    {/* Add more protected routes here */}
                </Route>
            </Routes>

            <Footer/>
        </div>
    );
}

export default App;