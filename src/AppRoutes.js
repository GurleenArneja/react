import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SharedLayout from './components/SharedLayout';
import Collections from './components/Collections';
import Documents from './components/Documents';
import Tasks from './components/Tasks';

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<SharedLayout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path='collections' element={<Collections/>}/>
            <Route path='tasks' element={<Tasks/>}/>
            <Route path='documents' element={<Documents/>}/>
          </Route>
        </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
