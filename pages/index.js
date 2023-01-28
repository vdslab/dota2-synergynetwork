import * as d3 from "d3";
import { image } from "d3";
import { useEffect, useRef, useState } from "react";
import { request } from "./api/api";

export default function Home({ jsonData, posData, _linksData }) {
  return (
    <div>
      <h1>Dota2 SynergyNetwork</h1>
      <div>
        <h2>Form</h2>
        <Form />
      </div>

      <div>
        <h2>HeroSynergyNetwork</h2>
        <ScatterPlot posData={posData} _linksData={_linksData} />
      </div>
    </div>
  );
}

function ScatterPlot({ posData, _linksData }) {
  const [nodesData, setNodesData] = useState(null);
  let _nodesData;
  const [linksData, setLinksData] = useState([{ source: 1, target: 1 }]);
  let links = [];
  const width = 1200;
  const height = 1200;
  const margin = 50;
  const imageSize = 2;
  useEffect(() => {
    if (posData) {
      _nodesData = new Array(posData.length);
      posData.map((data, i) => {
        _nodesData[i] = {
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
          show: 0,
        };
      });
      setNodesData(_nodesData);
    }
  }, []);

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
        {linksData.map((data, index) => {
          const s = nodesData.find((n) => {
            return n.id == data.source;
          });
          const t = nodesData.find((n) => {
            return n.id == data.target;
          });

          return (
            <g key={index}>
              <line
                x1={xScale(s.x) + (imageSize * 16) / 2}
                x2={xScale(t.x) + (imageSize * 16) / 2}
                y1={height - yScale(s.y) + (imageSize * 9) / 2}
                y2={height - yScale(t.y) + (imageSize * 9) / 2}
                stroke="black"
              ></line>
            </g>
          );
        })}
        {nodesData.map((data, index) => {
          return (
            <g
              key={index}
              transform={`translate(${xScale(data.x)},${
                height - yScale(data.y)
              })`}
              onClick={() => {
                let newNodesData = nodesData;
                newNodesData[index].show = Math.abs(
                  newNodesData[index].show - 1
                );
                setNodesData(newNodesData);
                links = [];
                _linksData.map((link) => {
                  nodesData.map((node) => {
                    if (node.show) {
                      if (node.id == link.source || node.id == link.target)
                        links.push(link);
                    }
                    setLinksData(links);
                  });
                });
              }}
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

function Form() {
  return (
    <div className="field">
      <label className="label">表示したいデータ</label>
      <div className="select">
        <select onChange={(e) => ChangeShowValue(e.target.value)}>
          <option>勝率差</option>
          <option>使用率</option>
          <option>勝率差 * 使用率</option>
        </select>
      </div>
    </div>
  );
}

function DropBox({ ChangeShowValue }) {
  return (
    <div className="field">
      <label className="label">表示したいデータ</label>
      <div className="select">
        <select onChange={(e) => ChangeShowValue(e.target.value)}>
          <option>勝率差</option>
          <option>使用率</option>
          <option>勝率差 * 使用率</option>
        </select>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const fs = require("fs");
  const jsonData = JSON.parse(fs.readFileSync("./public/dota2Data.json"));
  const posData = await request(jsonData);
  const _linksData = jsonData.getHeroCombinationWinLose
    .map((d, index) => {
      const s = posData.find((n) => {
        return n.id == d.hero1;
      });
      const t = posData.find((n) => {
        return n.id == d.hero2;
      });
      return {
        id: index,
        source: s.id,
        target: t.id,
        winRate: d.winrate,
      };
    })
    .sort((a, b) => -a.winRate + b.winRate)
    .filter((v) => v);
  console.log(_linksData);
  return {
    props: { jsonData, posData, _linksData },
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
