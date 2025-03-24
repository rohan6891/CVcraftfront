import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EnhanceCV from './components/EnhanceCV';
import CreateCV from './components/CreateCV';
import ATSScore from './components/ATSScore';
import LandingPage from './components/LandingPage';
import { LoginForm } from './components/LoginForm';
import SignupForm from './components/SignupForm';
import QuestionForm from './components/QuestionForm';
import JobFindings from './components/JobFindings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginForm onLoginSuccess={() => {}} />} />

        {/* Signup Page */}
        <Route path="/signup" element={<SignupForm onSignupSuccess={() => {}} />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/enhance-cv" element={<EnhanceCV />} />
                  <Route path="/create-cv" element={<CreateCV />} />
                  <Route path="/ats-score" element={<ATSScore />} />
                  <Route path="/generate" element={<QuestionForm />} />
                  <Route path="/job-findings" element={<JobFindings />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
