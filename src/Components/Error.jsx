import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error = ({ statusCode = 404, message = "Page not found" }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-6xl font-extrabold text-green-500 mb-4">
            {statusCode}
          </h2>
          <p className="text-xl font-semibold text-gray-700 mb-6">
            {message}
          </p>
          <p className="text-gray-500 mb-6">
            Oops! It seems like you've encountered an error. Don't worry, we're here to help.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Go back to homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;