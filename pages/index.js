import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { request } from "./api/api";

export default function Home({ jsonData, posData }) {
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
  let nodesData = null;
  const width = 1200;
  const height = 1200;
  const margin = 50;
  const imageSize = 2;

  if (posData) {
    nodesData = new Array(posData.length);
    posData.map((data, i) => {
      nodesData[i] = {
        heroName: data.heroname,
        id: data.id,
        image:
          "/heroIcons/" +
          data.heroname
            .toLowerCase()
            .replaceAll(" ", "_")
            .replaceAll("%20", "_") +
          ".png",
        x: data.posX,
        y: data.posY,
      };
    });
  }
  if (nodesData) {
    const xScale = d3
      .scaleLinear()
      .domain([
        Math.min(...nodesData.map((data) => data.x)),
        Math.max(...nodesData.map((data) => data.x)),
      ])
      .range([margin, width - margin])
      .nice();
    const yScale = d3
      .scaleLinear()
      .domain([
        Math.min(...nodesData.map((data) => data.y)),
        Math.max(...nodesData.map((data) => data.y)),
      ])
      .range([margin, height - margin])
      .nice();
    return (
      <ZoomableSVG width={width} height={height}>
        {nodesData.map((data, index) => {
          return (
            <g
              key={index}
              transform={`translate(${xScale(data.x)},${
                width - yScale(data.y)
              })`}
            >
              <image
                href={data.image}
                height={imageSize * 9}
                width={imageSize * 16}
                alt=""
              />
            </g>
          );
        })}
      </ZoomableSVG>
    );
  } else {
    return <h1>Not Data</h1>;
  }
}

export async function getStaticProps() {
  const fs = require("fs");
  const jsonData = JSON.parse(fs.readFileSync("./public/dota2Data.json"));
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
