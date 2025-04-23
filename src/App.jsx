// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';

import Header from './component/Header/Header.jsx';
import LoginPanel from './component/LoginPanel/LoginPanel.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import UserDashboard from './pages/UserDashboard/UserDashboard.jsx';
import ProtectedRoute from './component/ProtectedRoute.jsx';
import CTASection from "./component/CTASection/CTASection.jsx";
import Footer from "./component/Footer/Footer.jsx";

function App() {
    const [isLoginPanelOpen, setIsLoginPanelOpen] = useState(false);

    const toggleLoginPanel = (e) => {
        if (e) e.preventDefault();
        setIsLoginPanelOpen(!isLoginPanelOpen);
    };

    return (
        <AuthProvider>
            <div className="app-container">
                <Header onLoginClick={toggleLoginPanel} />

                <LoginPanel
                    isOpen={isLoginPanelOpen}
                    onClose={toggleLoginPanel}
                />

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>

                {/* CTA Section - Only show on homepage and certain public routes */}
                <Routes>
                    <Route path="/" element={
                        <CTASection
                            title="Transform Your Cleaning Business Today"
                            description="Join over 500 cleaning teams already using CleanMaster to optimize their operations and boost customer satisfaction."
                            buttonText="Start Your Free Trial"
                            secondaryButtonText="Book a Demo"
                            secondaryButtonLink="/demo"
                            backgroundClass="gradientBg"
                        />
                    } />
                    {/* You can add more routes where you want the CTA to appear */}
                </Routes>

                <Footer />
            </div>
        </AuthProvider>
    );
}

export default App;