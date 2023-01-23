import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { request } from "./api/api"

export default function Home({ jsonData, posData }) {
  console.log(jsonData);
  return (
    <div>
      <h1>Dota2 SynergyNetwork</h1>
      <div>
        <h2>HeroSynergyNetwork</h2>
        <ScatterPlot posData={posData} />
      </div>
    </div>
  );
}

function ScatterPlot({ posData }) {
  console.log(posData);

  // todo ZoomableSVGを適用した散布図を描く
}

export async function getStaticProps() {
  const fs = require('fs');
  const jsonData = JSON.parse(fs.readFileSync("/Users/ikko/大学/尾上ゼミ/dota2-synergynetwork/dota2Data.json"));
  const posData = await request(jsonData);

  return {
    props: { jsonData, posData },
  };
}

function ZoomableSVG({ children, width, height }) {
  const svgRef = useRef();
  const [k, setK] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  useEffect(() => {
    const zoom = d3.zoom().on("zoom", (event) => {
      const { x, y, k } = event.transform;
      setK(k);
      setX(x);
      setY(y);
    });
    d3.select(svgRef.current).call(zoom);
  }, []);
  return (
    <svg ref={svgRef} width={width} height={height}>
      <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
    </svg>
  );
}
