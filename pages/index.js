import { getHeroCombinationWinLose, getHeroData } from "./api/api";
import * as d3 from "d3";
import React, { useState, useEffect } from "react";

export default function Home({ _nodesData, _linksData }) {
  return (
    <div>
      <h1>Dota2 SynergyNetwork</h1>
      <div>
        <h2>HeroSynergyNetwork</h2>
        <Network _nodesData={_nodesData} _linksData={_linksData} />
      </div>
    </div>
  );
}

function Network({ _nodesData, _linksData }) {
  const [nodesData, setNodesData] = useState(_nodesData);
  const [linksData, setLinksData] = useState(_linksData);

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
  }, []);
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
  const heroData = await getHeroData();
  const _nodesData = heroData.rows.map((d) => {
    return (
      {
        id: d.id,
        heroName: d.heroname,
        r: 30,
        x: Math.floor(Math.random()),
        y: Math.floor(Math.random()),
      }
    );
  }).sort((a, b) => a.id - b.id);

  const heroCombinationWinLose = await getHeroCombinationWinLose();
  const _linksData = heroCombinationWinLose.rows.map(d => {
    const s = _nodesData.find(n => {
      return n.id == d.hero1;
    });
    const t = _nodesData.find(n => {
      return n.id == d.hero2;
    });
    return (
      {
        source: s,
        target: t,
        winRate: d.winrate,
      }
    );
  });
  return {
    props: { _nodesData: _nodesData, _linksData: _linksData },
  };
}
