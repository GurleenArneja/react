import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import SharedLayout from './components/SharedLayout';
import Collections from './components/Collections';
import Documents from './components/Documents';
import Tasks from './components/Tasks';
import { useSelector } from 'react-redux';

const AppRoutes = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/tpch" /> : <SignIn/>}
        />
        <Route
          path="/tpch"
          element={isLoggedIn ? <SharedLayout /> : <Navigate to="/" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="collections" element={<Collections />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="documents" element={<Documents />} />
        </Route>
        <Route path="/logout" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
