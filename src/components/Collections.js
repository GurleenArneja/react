import React from 'react';
import HeaderLinks from './HeaderLinks';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Collections = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    navigate('/');
  }
  return (
    <>
      <HeaderLinks header="Collections"/>
      <div className='mainContent'>
        <img className="schemaDiag" src="../schema.png" alt='schema'></img>
      </div>
    </>
  );
};

export default Collections;
