import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import Legend from "./components/Legend";
import "./Map.css";
import { setActiveOption } from "./redux/action-creators";
import { useSelector } from "react-redux";
import { activeSelector, dataSelector } from "./redux/selectors";

import markerImage from "./assets/marker_map_icon.png";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2hrY2hrY2hrb29oIiwiYSI6ImNsbHpkd3hzeDBoajIzZW4xZGF1MDVrdmcifQ.u-XvGRBRX0_ZUB8bRyT9Mg";

const Map = () => {
  const active = useSelector(activeSelector);
  const data = useSelector(dataSelector);
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/chkchkchkooh/cllzdmzqi00o001qxgwjg8t6p",
      center: [5, 34],
      zoom: 1.5,
      projection: "mercator",
    });

    map.on("load", () => {
      map.loadImage(markerImage, function (error, image) {
        if (error) throw error;
        map.addImage("custom-marker", image);
        // Add a GeoJSON source with multiple points
        map.addSource("points", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  message: "Foo",
                },
                geometry: {
                  type: "Point",
                  coordinates: [-0.118092, 51.509865],
                },
              },
            ],
          },
        });
        // Add a symbol layer
        map.addLayer({
          id: "points",
          type: "symbol",
          source: "points",
          layout: {
            "icon-image": "custom-marker",
            "icon-size": 0.08,
            // get the title name from the source's "title" property
            "text-field": ["get", "title"],
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 1.25],
            "text-anchor": "top",
          },
        });
      });

      setMap(map);
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  useEffect(() => {
    paint();
  }, [active]);

  const paint = () => {
    if (map) {
      // TODO: leaving it here, might be useful
    }
  };

  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
      <Legend />
    </div>
  );
};

export default Map;
