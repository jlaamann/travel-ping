"use client";

import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const PhotoMap = () => {
  const Map = ReactMapboxGl({
    accessToken:
      "pk.eyJ1IjoiY2hrY2hrY2hrb29oIiwiYSI6ImNsbHpkd3hzeDBoajIzZW4xZGF1MDVrdmcifQ.u-XvGRBRX0_ZUB8bRyT9Mg",
  });

  return (
    <Map
      style="mapbox://styles/mapbox/streets-v9"
      containerStyle={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <Layer type="symbol" id="marker" layout={{ "icon-image": "marker-15" }}>
        <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
      </Layer>
    </Map>
  );
};

export default PhotoMap;
