'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Neighborhood {
  id: string
  name: string
  avg_rent_sqft: number
  foot_traffic_score: number
  asian_dining_score: number
  competitor_count: number
  lat?: number
  lng?: number
}

interface MapComponentProps {
  neighborhoods: Neighborhood[]
  selectedLocation: { lat: number; lng: number; name: string } | null
  mapCenter: [number, number]
  mapZoom: number
  onNeighborhoodClick: (neighborhood: Neighborhood) => void
}

export default function MapComponent({
  neighborhoods,
  selectedLocation,
  mapCenter,
  mapZoom,
  onNeighborhoodClick
}: MapComponentProps) {
  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '100%', width: '100%' }}
      key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Neighborhood Markers */}
      {neighborhoods.map((neighborhood) => (
        neighborhood.lat && neighborhood.lng && (
          <Marker
            key={neighborhood.id}
            position={[neighborhood.lat, neighborhood.lng]}
            eventHandlers={{
              click: () => onNeighborhoodClick(neighborhood)
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">{neighborhood.name}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Rent:</span>
                    <span className="font-semibold text-orange-600">${neighborhood.avg_rent_sqft}/sq ft</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Foot Traffic:</span>
                    <span className="font-semibold">{neighborhood.foot_traffic_score}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Asian Demand:</span>
                    <span className="font-semibold">{neighborhood.asian_dining_score}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Competitors:</span>
                    <span className="font-semibold">{neighborhood.competitor_count}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        )
      ))}

      {/* Selected Location Marker */}
      {selectedLocation && (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">📍 {selectedLocation.name}</h3>
              <p className="text-sm text-gray-600">Your searched location</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}