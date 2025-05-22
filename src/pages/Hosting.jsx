
import React from 'react';
import { Navigate } from 'react-router-dom';

// This page is no longer directly used as "Hosting" is now a dropdown.
// It redirects to the default sub-page, for example, "Domains".
const Hosting = () => {
  return <Navigate to="/hosting/domains" replace />;
};

export default Hosting;
