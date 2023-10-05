import React from 'react';
import HeaderLinks from './HeaderLinks';

const Collections = () => {
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
