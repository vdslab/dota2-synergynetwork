import { getHeroCombinationWinLose, getHeroData } from "./api/api";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

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
  const width = 1000;
  const height = 1000;

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
              return d.winRate * 4;
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
  }, [nodesCount]);
  return (
    <ZoomableSVG width={width} height={height}>
      {linksData.map((data, index) => {
        const node1 = nodesData.find((x) => data.source.id == x.id);
        const node2 = nodesData.find((x) => data.target.id == x.id);
        return (
          <g key={index}>
            <line
              x1={node1.x}
              x2={node2.x}
              y1={node1.y}
              y2={node2.y}
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
              fontSize={"20px"}
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
  const heroData = await getHeroData();
  const _nodesData = heroData.rows
    .map((d) => {
      return {
        id: d.id,
        heroName: d.heroname,
        r: 30,
        x: Math.floor(Math.random()),
        y: Math.floor(Math.random()),
      };
    })
    .sort((a, b) => a.id - b.id);

  const heroCombinationWinLose = await getHeroCombinationWinLose();
  const _linksData = heroCombinationWinLose.rows.map((d) => {
    const s = _nodesData.find((n) => {
      return n.id == d.hero1;
    });
    const t = _nodesData.find((n) => {
      return n.id == d.hero2;
    });
    return {
      source: s,
      target: t,
      winRate: d.winrate,
    };
  });
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
