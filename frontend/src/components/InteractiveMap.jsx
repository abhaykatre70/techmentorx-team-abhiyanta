import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { geoMercator } from 'd3-geo';
import indiaTopo from '../data/india.json';

const PROJECTION_CONFIG = {
    scale: 1100,
    center: [78.9629, 22.5937] // Center of India
};

const GEOGRAPHY_STYLE = {
    default: { outline: 'none' },
    hover: { outline: 'none', filter: 'brightness(0.9)', cursor: 'pointer' },
    pressed: { outline: 'none' },
};

const InteractiveMap = React.memo(({ stateData, onStateClick, selectedState }) => {

    const getFillColor = (geo) => {
        const stateName = geo.properties.st_nm;
        if (!stateName) return '#E5E7EB';

        // Robust Normalization for Matching
        const normalizedGeoName = stateName.toLowerCase().replace(/&/g, 'and').replace(/union territory of /g, '').trim();

        // Find matching key in stateData
        const matchKey = Object.keys(stateData).find(key =>
            key.toLowerCase().replace(/&/g, 'and').replace(/union territory of /g, '').trim() === normalizedGeoName
        );

        const data = matchKey ? stateData[matchKey] : null;

        if (selectedState === stateName) return '#2563EB'; // Selected: Vibrant Blue

        if (!data) return '#E5E7EB'; // No Data: Light Gray

        // Dynamic Color Logic based on Urgency and Count
        if (data.urgency === 'critical') return '#DC2626'; // Critical: Deep Red
        if (data.urgency === 'high') return '#EA580C'; // High: Vibrant Orange

        // Gradient-like effect based on needs count
        if (data.needs > 10) return '#F59E0B'; // High Needs: Amber
        if (data.needs > 0) return '#FCD34D'; // Some Needs: Yellow

        if (data.reports > 5) return '#10B981'; // Active Reports: Emerald
        return '#34D399'; // Safe: Light Green
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-blue-50/20 rounded-xl overflow-hidden relative p-2">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={PROJECTION_CONFIG}
                width={800}
                height={700}
                className="w-full h-full object-contain"
            >
                <Geographies geography={indiaTopo}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const isSelected = selectedState === geo.properties.st_nm;
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={getFillColor(geo)}
                                    stroke="#FFFFFF"
                                    strokeWidth={0.8}
                                    style={GEOGRAPHY_STYLE}
                                    onClick={() => onStateClick && onStateClick(geo.properties.st_nm)}
                                    className={`${isSelected ? 'stroke-blue-700 stroke-[1.5]' : 'hover:scale-105 hover:shadow-lg'} transition-all duration-300 ease-in-out origin-center drop-shadow-sm`}
                                />
                            );
                        })
                    }
                </Geographies>
            </ComposableMap>

            {/* Compact Legend */}
            <div className="absolute bottom-4 right-4 bg-white/95 p-3 rounded-lg shadow-md text-xs border border-gray-100 backdrop-blur-sm z-10 transition-opacity hover:opacity-100 opacity-90">
                <h4 className="font-bold mb-2 text-gray-800 border-b pb-1">Live Status</h4>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-600 rounded-sm shadow-sm"></div> <span className="font-medium text-gray-700">Critical</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-600 rounded-sm shadow-sm"></div> <span className="font-medium text-gray-700">High Priority</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-400 rounded-sm shadow-sm"></div> <span className="font-medium text-gray-700">Needs Help</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm shadow-sm"></div> <span className="font-medium text-gray-700">Active</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-200 rounded-sm shadow-sm border border-gray-300"></div> <span className="font-medium text-gray-500">No Data</span></div>
                </div>
            </div>
        </div>
    );
});

export default InteractiveMap;
