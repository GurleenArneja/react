import React, { useEffect, useState } from 'react';
import HeaderLinks from './HeaderLinks';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Collections = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [schemaData, setSchemaData] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    } else {
      // Fetch the JSON data from schema.json
      fetch('../schema.json') // Make sure the path to your JSON file is correct
        .then((response) => response.json())
        .then((data) => {
          setSchemaData(data);
        })
        .catch((error) => {
          console.error('Error loading JSON data:', error);
        });
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <HeaderLinks header="Collections" />
      <div className="mainContent">
        <h3>Orders Schema</h3>
        {schemaData ? (
          <pre>{JSON.stringify(schemaData, null, 2)}</pre>
        ) : (
          <p>Loading JSON data...</p>
        )}
      </div>
    </>
  );
};

export default Collections;
