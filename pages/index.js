import { getHeroCombinationWinLose } from "./api/api";
import * as d3 from "d3";
import React, { useState, useEffect } from "react";

export default function Home(data) {
  console.log(data);
  return (
    <div>
      <h1>Dota2 SynergyNetwork</h1>
      <div>
        <h2>HeroSynergyNetwork</h2>
        <Network data={data} />
      </div>
    </div>
  );
}

function Network(data) {
  const [nodesData, setNodesData] = useState([
    {
      id: 0,
      r: 30,
      text: "Node0",
    },
    {
      id: 1,
      r: 30,
      text: "Node1",
    },
    {
      id: 2,
      r: 30,
      text: "Node2",
    },
    { id: 3, r: 30, text: "Node3" },
    { id: 4, r: 30, text: "Node4" },
    { id: 5, r: 30, text: "Node5" },
    {
      id: 6,
      x: 149.98390958868998,
      y: 258.84586649697144,
      r: 30,
      text: "Node6",
    },
  ]);
  const [linksData, setLinksData] = useState([
    { source: 0, target: 1, len: 30 },
    { source: 0, target: 2, len: 45 },
    { source: 0, target: 3, len: 79 },
    { source: 0, target: 4, len: 90 },
    { source: 0, target: 5, len: 39 },
    { source: 0, target: 6, len: 82 },
    { source: 1, target: 2, len: 55 },
    { source: 1, target: 3, len: 43 },
    { source: 1, target: 4, len: 91 },
    { source: 1, target: 5, len: 13 },
    { source: 1, target: 6, len: 43 },
    { source: 2, target: 3, len: 56 },
    { source: 2, target: 4, len: 78 },
    { source: 2, target: 5, len: 32 },
    { source: 2, target: 6, len: 45 },
    { source: 3, target: 4, len: 67 },
    { source: 3, target: 5, len: 21 },
    { source: 3, target: 6, len: 67 },
    { source: 4, target: 5, len: 21 },
    { source: 4, target: 6, len: 56 },
    { source: 5, target: 6, len: 21 },
  ]);
  const width = 600;
  const height = 600;

  useEffect(() => {
    const startSimulation = (nodes, links) => {
      const simulation = d3
        .forceSimulation()
        .force(
          "collide",
          d3
            .forceCollide(nodes)
            .radius(function (d) {
              return d.r;
            })
            .strength(0.3)
            .iterations(32)
        )
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX().x(width / 2))
        .force("y", d3.forceY().y(height / 2))
        .force(
          "link",
          d3
            .forceLink()
            .id((d) => d.id)
            .distance(function (d) {
              return d.len * 4;
            })
            .iterations(1)
        );
      simulation.nodes(nodes).on("tick", ticked);
      simulation.force("link").links(links);
      function ticked() {
        setNodesData(nodes.slice());
      }
    };
    startSimulation(nodesData, linksData);
  });
  return (
    <div>
      <svg width="800" height="800">
        {nodesData.map((data, index) => {
          return (
            <g key={index}>
              <circle cx={data.x} cy={data.y} r={data.r} fill="blue"></circle>
              <text
                textAnchor="middle"
                stroke="black"
                fill="Red"
                fontSize={"20px"}
                x={data.x}
                y={data.y}
              >
                {data.id}
              </text>
            </g>
          );
        })}
        {linksData.map((data, index) => {
          return (
            <g key={index}>
              <line
                x1={data.source.x}
                x2={data.target.x}
                y1={data.source.y}
                y2={data.target.y}
                stroke="black"
              ></line>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export async function getStaticProps() {
  console.log("getStaticProps");
  const data = await getHeroCombinationWinLose();
  return {
    props: { data },
  };
}
