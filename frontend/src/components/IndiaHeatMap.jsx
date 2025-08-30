import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

// Simplified India TopoJSON URL (using a public CDN)
const INDIA_TOPO_JSON = "https://cdn.jsdelivr.net/npm/india-maps-topojson@1.0.0/State.json";

// State name mapping for consistency
const stateNameMapping = {
  'Andhra Pradesh': 'Andhra Pradesh',
  'Arunachal Pradesh': 'Arunachal Pradesh',
  'Assam': 'Assam',
  'Bihar': 'Bihar',
  'Chhattisgarh': 'Chhattisgarh',
  'Goa': 'Goa',
  'Gujarat': 'Gujarat',
  'Haryana': 'Haryana',
  'Himachal Pradesh': 'Himachal Pradesh',
  'Jharkhand': 'Jharkhand',
  'Karnataka': 'Karnataka',
  'Kerala': 'Kerala',
  'Madhya Pradesh': 'Madhya Pradesh',
  'Maharashtra': 'Maharashtra',
  'Manipur': 'Manipur',
  'Meghalaya': 'Meghalaya',
  'Mizoram': 'Mizoram',
  'Nagaland': 'Nagaland',
  'Odisha': 'Odisha',
  'Punjab': 'Punjab',
  'Rajasthan': 'Rajasthan',
  'Sikkim': 'Sikkim',
  'Tamil Nadu': 'Tamil Nadu',
  'Telangana': 'Telangana',
  'Tripura': 'Tripura',
  'Uttar Pradesh': 'Uttar Pradesh',
  'Uttarakhand': 'Uttarakhand',
  'West Bengal': 'West Bengal'
};

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

  return (
    <div className="w-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          center: [78.9629, 20.5937]
        }}
        width={800}
        height={600}
      >
        <Geographies geography={INDIA_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map(geo => {
              const stateName = geo.properties.NAME_1 || geo.properties.st_nm;
              const stateData = getStateData(stateName);
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getStateColor(stateName)}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { 
                      outline: 'none',
                      fill: '#2563eb',
                      cursor: 'pointer'
                    },
                    pressed: { outline: 'none' }
                  }}
                  onClick={() => onStateClick && onStateClick(stateData)}
                  onMouseEnter={() => onStateHover && onStateHover(stateData)}
                  onMouseLeave={() => onStateHover && onStateHover(null)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4">
        <span className="text-sm text-muted-foreground">Low</span>
        <div className="flex space-x-1">
          {[0, 20, 40, 60, 80, 100].map((intensity) => (
            <div
              key={intensity}
              className="w-6 h-4"
              style={{
                backgroundColor: colorScale(minValue + (maxValue - minValue) * (intensity / 100))
              }}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">High</span>
      </div>
    </div>
  );
};

export default IndiaHeatMap;