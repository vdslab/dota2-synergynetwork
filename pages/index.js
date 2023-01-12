import { getHeroCombinationWinLose, getHeroData } from "./api/api";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { count, index } from "d3";

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
  const nodesCount = 10;
  const [nodesData, setNodesData] = useState(_nodesData);
  const [linksData, setLinksData] = useState(_linksData);
  const width = 1000;
  const height = 1000;

  useEffect(() => {
    const startSimulation = (nodes, links) => {
      const simulation = d3
        .forceSimulation()
        .force(
          "link",
          d3
            .forceLink()
            .id((d) => d.id)
            .distance(function (d) {
              return (1.1 - d.winRate) * 1000;
            })
            .strength(0.01)
            .iterations(128)
        )
        .force(
          "collide",
          d3
            .forceCollide()
            .radius(function (d) {
              return d.r;
            })
            .strength(0.7)
            .iterations(128)
        )
        .force("charge", d3.forceManyBody().strength(-2000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX().x(width / 2))
        .force("y", d3.forceY().y(height / 2));
      simulation.nodes(nodesData).on("tick", ticked);
      simulation
        .force("link")
        .links(linksData)
        .id(function (d) {
          return d.index;
        });
      function ticked() {
        setNodesData(nodes.slice());
        setLinksData(links.slice());
      }
    };
    startSimulation(nodesData, linksData);
    const winRateAndDist = linksData
      .map((d) => {
        const di = Math.sqrt(
          (d.source.x - d.target.x) ** 2 + (d.source.y - d.target.y) ** 2
        );
        return {
          id: d.id,
          s: d.source.heroName,
          t: d.target.heroName,
          wi: d.winRate,
          dist: di,
        };
      })
      .sort((a, b) => a.dist - b.dist);
    console.log(winRateAndDist);
  }, [nodesCount]);
  return (
    <ZoomableSVG width={width} height={height}>
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

      {nodesData.map((data, index) => {
        return (
          <g key={index}>
            <circle cx={data.x} cy={data.y} r={data.r} fill="blue"></circle>
            <text
              textAnchor="middle"
              stroke="black"
              fill="Red"
              fontSize={"10px"}
              x={data.x}
              y={data.y}
            >
              {data.heroName}
            </text>
          </g>
        );
      })}
    </ZoomableSVG>
  );
}

export async function getStaticProps() {
  console.log("getStaticProps");
  const max_id = 50;
  const heroData = await getHeroData();
  const _nodesData = heroData.rows
    .map((d) => {
      if (d.id < max_id) {
        return {
          id: d.id,
          x: Math.floor(Math.random()),
          y: Math.floor(Math.random()),
          r: 30,
          heroName: d.heroname,
        };
      }
    })
    .sort((a, b) => a.id - b.id)
    .filter((v) => v);

  const heroCombinationWinLose = await getHeroCombinationWinLose();
  const _linksData = heroCombinationWinLose.rows
    .map((d, index) => {
      if (d.hero1 < max_id && d.hero2 < max_id) {
        //
        const s = _nodesData.find((n) => {
          return n.id == d.hero1;
        });
        const t = _nodesData.find((n) => {
          return n.id == d.hero2;
        });
        return {
          id: index,
          source: s.id,
          target: t.id,
          winRate: d.winrate,
        };
      }
    })
    .sort((a, b) => -a.winRate + b.winRate)
    .filter((v) => v);
  return {
    props: { _nodesData: _nodesData, _linksData: _linksData },
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
