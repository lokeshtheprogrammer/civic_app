import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Map = ({ issues }) => {
    const defaultPosition = [20.5937, 78.9629]; // Centered on India

    return (
        <MapContainer center={defaultPosition} zoom={5} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} className="rounded-lg">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {issues.map(issue => (
                <Marker key={issue.id} position={[issue.location.lat, issue.location.lng]}>
                    <Popup>
                        <div className="font-sans">
                            <h3 className="font-bold text-base mb-1">{issue.title}</h3>
                            <p className="text-sm text-gray-600">{issue.category}</p>
                            <p className="text-sm font-medium text-red-500">Priority: {issue.priority}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
