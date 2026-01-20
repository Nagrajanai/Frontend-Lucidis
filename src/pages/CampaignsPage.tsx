import React from 'react';

const CampaignsPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage outbound email and SMS campaigns</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          Create Campaign
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No active campaigns</h3>
        <p className="text-gray-500 mb-6">Launch a new campaign to engage with your audience.</p>
        <button className="text-indigo-600 font-medium hover:text-indigo-700">
          Start a new campaign &rarr;
        </button>
      </div>
    </div>
  );
};

export default CampaignsPage;
