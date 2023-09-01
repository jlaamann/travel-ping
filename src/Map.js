import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import Legend from "./components/Legend";
import Optionsfield from "./components/Optionsfield";
import "./Map.css";
import { setActiveOption } from "./redux/action-creators";
import { useSelector } from "react-redux";
import { activeSelector, dataSelector } from "./redux/selectors";

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
    });

    const images = {
      popup:
        "https://as2.ftcdn.net/v2/jpg/00/97/58/97/1000_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg",
    };

    map.on("load", () => {
      map.loadImage(
        "https://as2.ftcdn.net/v2/jpg/00/97/58/97/1000_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg",
        function (error, image) {
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
                    iconSize: [60, 60],
                  },
                  geometry: {
                    type: "Point",
                    coordinates: [0, 50],
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
              "icon-size": 0.1,
              // get the title name from the source's "title" property
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });
        }
      );

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
      <Optionsfield changeState={setActiveOption} />
    </div>
  );
};

export default Map;
