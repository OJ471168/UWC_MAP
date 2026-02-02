import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { EventData, FilterState } from '../types';
import { getCategoryColor } from '../constants';

// Fix Leaflet Default Icon
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom colored icons using SVG to support any hex color while maintaining pin style
const createColorIcon = (color: string) => {
    return L.divIcon({
        className: 'bg-transparent',
        html: `
        <svg viewBox="0 0 30 42" width="30" height="42" xmlns="http://www.w3.org/2000/svg" style="overflow: visible; filter: drop-shadow(2px 4px 4px rgba(0,0,0,0.3));">
            <path d="M15 0C6.7 0 0 6.7 0 15c0 10 15 27 15 27s15-17 15-27C30 6.7 23.3 0 15 0z" fill="${color}" stroke="white" stroke-width="1.5"/>
            <circle cx="15" cy="15" r="5" fill="white"/>
        </svg>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -38],
    });
};

interface MapProps {
    events: EventData[];
    filters: FilterState;
    onSelectEvent: (e: EventData) => void;
    selectedEvent: EventData | null;
}

const ClusterLayer: React.FC<{ events: EventData[]; onSelectEvent: (e: EventData) => void }> = ({ events, onSelectEvent }) => {
    const map = useMap();
    // Use any for ref type as MarkerClusterGroup type is not properly augmented in this environment
    const clusterGroupRef = useRef<any>(null);

    useEffect(() => {
        // Create cluster group if not exists
        if (!clusterGroupRef.current) {
            // Cast L to any to access markerClusterGroup which is added by the import 'leaflet.markercluster'
            clusterGroupRef.current = (L as any).markerClusterGroup({
                chunkedLoading: true,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: false, // Disable default to handle manually
                spiderfyOnMaxZoom: true,
                disableClusteringAtZoom: 18,
                maxClusterRadius: 55 // Reduced further to prevent grouping distant pins
            });

            // Add custom click handler for zoom with padding and maxZoom cap
            clusterGroupRef.current.on('clusterclick', (a: any) => {
                const currentZoom = map.getZoom();
                // If we are zoomed out (e.g., viewing continent/country), prevent zooming "all the way" (e.g., to street level 18)
                // Cap the zoom at 15 (neighborhood/city level) first.
                // If the user is already at or past 15, allow full zoom/spiderfy behavior.
                if (currentZoom < 15) {
                    a.layer.zoomToBounds({ padding: [20, 20], maxZoom: 15 });
                } else {
                    a.layer.zoomToBounds({ padding: [20, 20] });
                }
            });

            map.addLayer(clusterGroupRef.current);
        }

        const clusterGroup = clusterGroupRef.current;
        clusterGroup.clearLayers();

        const markers = events.map(ev => {
            const icon = createColorIcon(getCategoryColor(ev.category));
            const marker = L.marker([ev.lat, ev.lng], { icon });
            
            marker.on('click', () => {
                onSelectEvent(ev);
            });
            
            // Add a simple tooltip for hover
            marker.bindTooltip(ev.title, { direction: 'top', offset: [0, -40] });

            return marker;
        });

        clusterGroup.addLayers(markers);

        return () => {
            // No cleanup needed here as we want to persist the group reference
            // Cleanup happens in the effect below on unmount
        };
    }, [events, map, onSelectEvent]);

    useEffect(() => {
        return () => {
            if (clusterGroupRef.current && map) {
                map.removeLayer(clusterGroupRef.current);
            }
        };
    }, [map]);

    return null;
};

const MapController: React.FC<{ 
    selectedEvent: EventData | null; 
    filters: FilterState; 
}> = ({ selectedEvent, filters }) => {
    const map = useMap();

    useEffect(() => {
        if (selectedEvent) {
            map.invalidateSize(); // Ensure map knows its size changed if panel opened
            map.flyTo([selectedEvent.lat, selectedEvent.lng], 15, { duration: 1.5 });
        }
    }, [selectedEvent, map]);

    useEffect(() => {
        if (filters.userLocation) {
            map.flyTo([filters.userLocation.lat, filters.userLocation.lng], 9, { duration: 1.5 });
        }
    }, [filters.userLocation, map]);

    return null;
};

// Component to handle View Full Map button visibility and logic
const MapInterface: React.FC = () => {
    const map = useMap();
    const [showReset, setShowReset] = useState(false);

    useMapEvents({
        zoomend: () => {
            setShowReset(map.getZoom() > 3);
        },
        moveend: () => {
            setShowReset(map.getZoom() > 3);
        }
    });

    useEffect(() => {
        const handleExternalReset = () => {
            map.flyTo([20, 0], 2, { duration: 1.5 });
            // We also need to invalidate size just in case the layout shifted back
            setTimeout(() => map.invalidateSize(), 300); 
        };
        window.addEventListener('resetMap', handleExternalReset);
        return () => window.removeEventListener('resetMap', handleExternalReset);
    }, [map]);

    if (!showReset) return null;

    return (
        <button 
            onClick={(e) => {
                e.stopPropagation(); // Prevent map click
                window.dispatchEvent(new CustomEvent('resetMap')); // Clears App state
                map.flyTo([20, 0], 2, { duration: 1.5 });
            }} 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-6 py-3 rounded-full shadow-xl font-bold border border-gray-100 flex items-center gap-2 hover:bg-indigo-900 hover:text-white transition-all z-[1000] group animate-in fade-in slide-in-from-bottom-4"
        >
            <span>🌍</span> View Full Map
        </button>
    );
};

const MapResizer: React.FC = () => {
    const map = useMap();
    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });
        resizeObserver.observe(map.getContainer());
        return () => resizeObserver.disconnect();
    }, [map]);
    return null;
};

const MapView: React.FC<MapProps> = ({ events, filters, onSelectEvent, selectedEvent }) => {
    return (
        <div className="flex-grow h-full w-full relative z-0">
            <MapContainer 
                center={[20, 0]} 
                zoom={2} 
                scrollWheelZoom={true} 
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                
                {filters.userLocation && (
                    <>
                        <Marker position={[filters.userLocation.lat, filters.userLocation.lng]}>
                            <Popup>You are here</Popup>
                        </Marker>
                        <Circle 
                            center={[filters.userLocation.lat, filters.userLocation.lng]} 
                            radius={filters.radius} 
                            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }} 
                        />
                    </>
                )}

                <ClusterLayer events={events} onSelectEvent={onSelectEvent} />

                <MapController selectedEvent={selectedEvent} filters={filters} />
                <MapInterface />
                <MapResizer />
            </MapContainer>
        </div>
    );
};

export default MapView;
