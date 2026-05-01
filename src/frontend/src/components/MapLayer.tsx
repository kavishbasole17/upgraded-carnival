import React, { useMemo } from "react";
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
  // 🔥 Compute max score for normalization
  const maxScore = useMemo(() => {
    const values = Object.values(heatData).map((d: any) => d.score);
    return Math.max(...values, 1);
  }, [heatData]);

  // 🎨 Smooth red gradient
  const getColor = (score: number) => {
    const ratio = score / maxScore;

    const r = 255;
    const g = Math.floor(255 * (1 - ratio));
    const b = Math.floor(255 * (1 - ratio));

    return `rgb(${r}, ${g}, ${b})`;
  };

  const getStyle = (feature: any) => {
    const name = feature.properties.district_name?.toUpperCase();
    const score = heatData[name]?.score || 0;

    return {
      fillColor: getColor(score),
      weight: 1.5,
      opacity: 1,
      color: "#94a3b8",
      fillOpacity: score > 0 ? 0.7 : 0.1,
    };
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[15.9129, 79.74]}
        zoom={7}
        style={{
          height: "100%",
          width: "100%",
          background: "transparent",
          zIndex: 1,
        }}
        zoomControl={false}
        attributionControl={false}
      >
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={getStyle}
            onEachFeature={(feature, layer) => {
              const district = feature.properties.district_name;

              layer.on("click", () => {
                onDistrictSelect(district);
              });

              layer.on("mouseover", (e) => {
                const target = e.target;
                target.setStyle({
                  weight: 2.5,
                  color: "#4f46e5",
                  fillOpacity: 0.85,
                });
              });

              layer.on("mouseout", (e) => {
                const target = e.target;
                target.setStyle(getStyle(feature));
              });

              // 🧠 Tooltip
              const data = heatData[district?.toUpperCase()];
              if (data) {
                layer.bindTooltip(
                  `${district}<br/>Tickets: ${data.count}<br/>Score: ${data.score}`,
                  { sticky: true },
                );
              }
            }}
          />
        )}
      </MapContainer>

      {/* 🔴 Legend (minimal, clean) */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-2 rounded-lg shadow text-xs">
        <p className="font-semibold text-slate-700 mb-1">Priority</p>
        <div className="flex items-center gap-2">
          <span>Low</span>
          <div
            className="w-20 h-2 rounded"
            style={{
              background:
                "linear-gradient(to right, rgb(255,230,230), rgb(255,0,0))",
            }}
          />
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

export default MapLayer;
