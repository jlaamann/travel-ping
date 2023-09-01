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

    const locations = [
      {
        coordinates: [-0.118092, 51.509865],
        imageUrl:
          "https://images.contentstack.io/v3/assets/blt00454ccee8f8fe6b/bltf5fca6a3eec4d180/6139d40bec680b43eb02a9ee/US_London_UK_Header.jpg?width=1920&quality=70&auto=webp",
        description: "Having a blast in London, long live the queen",
        timestamp: "12/9/2023",
      },
      {
        coordinates: [-99, 19],
        imageUrl:
          "https://assets3.thrillist.com/v1/image/3141329/2880x1620/crop;webp=auto;jpeg_quality=60;progressive.jpg",
        description: "Drank too many glasses of mezcal yesterday",
        timestamp: "23/3/2023",
      },
      {
        coordinates: [115, -8],
        imageUrl: "https://balicheapesttours.com/dummy/ubud.jpg",
        description: "Finding myself in Ubud",
        timestamp: "10/2/2023",
      },
    ];

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
                  message: "Foo",
                  description,
                  imageUrl,
                  timestamp,
                },
                geometry: {
                  type: "Point",
                  coordinates,
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
      const timestampHtml = `<i>${e.features[0].properties.timestamp}</i>`;

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
