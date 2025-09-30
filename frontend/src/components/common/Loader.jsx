import React from 'react';

export default function Loader() {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-red-600" />
    </div>
  );
}

