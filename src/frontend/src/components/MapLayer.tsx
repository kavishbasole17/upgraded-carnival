import React from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  heatData: Record<string, any>;
  geoJsonData: any;
  onDistrictSelect: (name: string) => void;
}

const MapLayer: React.FC<MapProps> = ({
  heatData,
  geoJsonData,
  onDistrictSelect,
}) => {
  const getStyle = (feature: any) => {
    const name = feature.properties.district_name;
    const score = heatData[name]?.score || 0;

    const fillColor =
      score > 50 ? "#ef4444" : score > 20 ? "#f59e0b" : "#3b82f6"; // Tailwind colors

    return {
      fillColor: fillColor,
      weight: 1.5,
      opacity: 1,
      color: "#94a3b8", // slate-400
      fillOpacity: score > 0 ? 0.6 : 0.1,
    };
  };

  return (
    <MapContainer
      center={[15.9129, 79.74]}
      zoom={7}
      style={{ height: "100%", width: "100%", background: "transparent", zIndex: 1 }}
      zoomControl={false}
      attributionControl={false}
    >
      {geoJsonData && (
        <GeoJSON
          data={geoJsonData}
          style={getStyle}
          onEachFeature={(feature, layer) => {
            layer.on("click", () => {
              onDistrictSelect(feature.properties.district_name);
            });
            layer.on("mouseover", (e) => {
              const target = e.target;
              target.setStyle({ weight: 2.5, color: "#4f46e5", fillOpacity: 0.8 }); // hover state
            });
            layer.on("mouseout", (e) => {
              const target = e.target;
              target.setStyle(getStyle(feature));
            });
          }}
        />
      )}
    </MapContainer>
  );
};

export default MapLayer;
