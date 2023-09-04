import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
import Legend from "./components/Legend";
import "./Map.css";
import logo from "./assets/logo.png";

import markerImage from "./assets/heart_icon.png";
import { findAllLocations } from "./services/locations";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2hrY2hrY2hrb29oIiwiYSI6ImNsbHpkd3hzeDBoajIzZW4xZGF1MDVrdmcifQ.u-XvGRBRX0_ZUB8bRyT9Mg";

const Map = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  const fetchData = async () => {
    setLoading(true);

    const res = await findAllLocations();

    setLocations([...res]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/chkchkchkooh/cllzdmzqi00o001qxgwjg8t6p",
      center: [5, 34],
      zoom: 2,
      // projection: "mercator",
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
            features: locations.map(
              ({ coordinates, imageUrl, description, timestamp }) => ({
                type: "Feature",
                properties: {
                  description,
                  imageUrl,
                  timestamp,
                },
                geometry: {
                  type: "Point",
                  coordinates: [coordinates._long, coordinates._lat],
                },
              })
            ),
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

    map.on("click", "points", (e) => {
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      const imageHtml = `<img src="${e.features[0].properties.imageUrl}">`;
      const timestampJson = JSON.parse(e.features[0].properties.timestamp);
      const formattedTimestamp = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }).format(timestampJson.seconds * 1000);
      const timestampHtml = `<i>${formattedTimestamp}</i>`;

      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(coordinates)
        .setHTML(imageHtml + description + "</br>" + timestampHtml)
        .addTo(map);
    });

    map.on("mouseenter", "points", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "points", () => {
      map.getCanvas().style.cursor = "";
    });

    // Clean up on unmount
    return () => map.remove();
  }, [locations]);

  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
      <Legend locations={locations} />
      <div className="bg-transparent absolute top left mr12 mb24 py12 px12 z1 wmax180">
        <img src={logo} />
      </div>
    </div>
  );
};

export default Map;
