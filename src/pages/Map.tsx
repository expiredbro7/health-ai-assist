import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icons in Vite
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface Hospital {
  name: string;
  lat: number;
  lng: number;
}

export default function HealthcareMap() {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 1. Get user GPS location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation([latitude, longitude]);
        },
        () => setError("Unable to fetch your location")
      );
    } else {
      setError("Geolocation not supported in this browser");
    }
  }, []);

  // 2. Fetch hospitals near the user
  useEffect(() => {
    if (location) {
      const [lat, lng] = location;
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=10&q=hospital&addressdetails=1&bounded=1&polygon_geojson=0&extratags=1&viewbox=${lng - 0.05},${lat + 0.05},${lng + 0.05},${lat - 0.05}`
      )
        .then((res) => res.json())
        .then((data) => {
          const mapped: Hospital[] = data.map((item: any) => ({
            name: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          }));
          setHospitals(mapped);
        })
        .catch(() => setError("Failed to fetch nearby hospitals"));
    }
  }, [location]);

  return (
    <div className="h-screen w-full">
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {location ? (
        <MapContainer center={location} zoom={14} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* User marker */}
          <Marker position={location}>
            <Popup>📍 You are here</Popup>
          </Marker>
          {/* Hospital markers */}
          {hospitals.map((h, idx) => (
            <Marker key={idx} position={[h.lat, h.lng]}>
              <Popup>{h.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p className="text-center mt-4">📍 Fetching your location...</p>
      )}
    </div>
  );
}
