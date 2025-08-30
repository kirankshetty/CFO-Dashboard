import React from 'react';
import { scaleLinear } from 'd3-scale';

const IndiaHeatMap = ({ data, metric = 'storeCount', onStateClick, onStateHover }) => {
  // Create color scale based on the metric
  const values = data.map(d => d[metric]);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  
  const colorScale = scaleLinear()
    .domain([minValue, maxValue])
    .range(['#e3f2fd', '#1565c0']); // Light blue to dark blue

  const getStateData = (stateName) => {
    return data.find(d => d.state === stateName) || {};
  };

  const getStateColor = (stateName) => {
    const stateData = getStateData(stateName);
    return stateData[metric] ? colorScale(stateData[metric]) : '#f5f5f5';
  };

  // Simplified state representation as cards in grid format
  // This is a fallback when the map library doesn't work
  const statesByRegion = {
    'North': ['Punjab', 'Haryana', 'Himachal Pradesh', 'Uttarakhand', 'Uttar Pradesh'],
    'West': ['Rajasthan', 'Gujarat', 'Maharashtra', 'Goa'],
    'South': ['Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana'],
    'East': ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand'],
    'Northeast': ['Assam', 'Meghalaya', 'Manipur', 'Mizoram', 'Tripura', 'Nagaland', 'Arunachal Pradesh', 'Sikkim'],
    'Central': ['Madhya Pradesh', 'Chhattisgarh']
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg p-4 border">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">India - State Performance Map</h3>
          <p className="text-sm text-gray-500">Click on states to view details</p>
        </div>
        
        <div className="space-y-4">
          {Object.entries(statesByRegion).map(([region, states]) => (
            <div key={region} className="border rounded-lg p-3">
              <h4 className="font-semibold text-sm text-gray-600 mb-2">{region}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {states.map(state => {
                  const stateData = getStateData(state);
                  const hasData = stateData && stateData[metric];
                  
                  return (
                    <div
                      key={state}
                      className="relative p-2 rounded cursor-pointer border transition-all duration-200 hover:shadow-md"
                      style={{
                        backgroundColor: hasData ? getStateColor(state) : '#f8f9fa',
                        color: hasData && stateData[metric] > (maxValue * 0.6) ? 'white' : '#374151'
                      }}
                      onClick={() => onStateClick && onStateClick(stateData)}
                      onMouseEnter={() => onStateHover && onStateHover(stateData)}
                      onMouseLeave={() => onStateHover && onStateHover(null)}
                    >
                      <div className="text-xs font-medium truncate">{state}</div>
                      {hasData && (
                        <div className="text-xs opacity-90">
                          {metric === 'revenue' 
                            ? `₹${(stateData[metric] / 100000).toFixed(1)}L`
                            : stateData[metric]
                          }
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4">
        <span className="text-sm text-gray-500">Low</span>
        <div className="flex space-x-1">
          {[0, 20, 40, 60, 80, 100].map((intensity) => (
            <div
              key={intensity}
              className="w-6 h-4 border border-gray-200"
              style={{
                backgroundColor: colorScale(minValue + (maxValue - minValue) * (intensity / 100))
              }}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">High</span>
        <div className="ml-4 text-xs text-gray-500">
          {metric === 'storeCount' && 'Store Count'}
          {metric === 'headcount' && 'Employee Count'}
          {metric === 'revenue' && 'Revenue (Lakhs)'}
        </div>
      </div>
    </div>
  );
};

export default IndiaHeatMap;