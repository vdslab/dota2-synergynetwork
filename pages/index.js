import * as d3 from "d3";
import { image } from "d3";
import { useEffect, useRef, useState } from "react";
import { request } from "./api/api";
import { NewAppBar } from "./components/NewAppBar.js";
import { trimmingIcon } from "./components/TrimmingIcon";
import { DisplayData } from "./components/DisplayData";

export default function Home({ _posData, _linksData }) {
  const [posData, setPosData] = useState(_posData);
  const [linksdata, setLinksData] = useState(null);
  const [selectedNode, setSelectedNode] = useState([-1, -1]);

  function updateLinksData() {
    const trans = {}
    _posData.map((d) => {
      trans[d.id.toString()] = d.c_id;
    })

    setLinksData(_linksData.map((d) => {
      return (
        {
          source: d.hero1,
          target: d.hero2,
          source_c: trans[d.hero1.toString()],
          target_c: trans[d.hero2.toString()],
          win: d.win,
          lose: d.lose,
        }
      );
    }));
  }

  useEffect(() => {
    updateLinksData();
  }, [posData]);

  //return (<div></div>);

  if (linksdata == null) {
    return (<div>読み込み中...</div>);
  }

  return (
    <div>
      <ScatterPlot
        posData={posData}
        linksData={linksdata}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />
    </div>
  );
}

function ScatterPlot({ posData, linksData, selectedNode, setSelectedNode }) {
  const width = 1200;
  const height = 1200;
  const margin = 50;
  const imageSize = 4.5;

  function xyScale() {
    const xScale = d3
      .scaleLinear()
      .domain([
        Math.min(...posData.map((data) => data.x)),
        Math.max(...posData.map((data) => data.x)),
      ])
      .range([margin, width - margin])
      .nice();
    const yScale = d3
      .scaleLinear()
      .domain([
        Math.min(...posData.map((data) => data.y)),
        Math.max(...posData.map((data) => data.y)),
      ])
      .range([margin, height - margin])
      .nice();
    return { xScale, yScale };
  }

  function updateSelectedNode(id) {
    const index = selectedNode.indexOf(id);
    const count = (selectedNode[0] != -1 ? 1 : 0) + (selectedNode[1] != -1 ? 1 : 0);
    let c = 0;
    console.log(`index: ${index}`);
    console.log(`count: ${count}`);

    if (index != -1) {
      console.log("既に存在している場合:削除される");
      setSelectedNode(selectedNode.map((e, i) => {
        if (i == index) {
          return (-1);
        }
        return (e);
      }));
    } else if (count == 2) {
      console.log("既に2つ選択していてさらに選択しようとしている場合:何も起こらない");
      //do nothing
    } else if (count == 0 || count == 1) {
      console.log("新たに選択する場合:追加される");
      setSelectedNode(selectedNode.map((e, i) => {
        if (e == -1 && c == 0) {
          c++;
          return (id);
        }
        return (e);
      }));
    }
  }

  const { xScale, yScale } = xyScale();

  return (
    <ZoomableSVG width={width} height={height}>
      {linksData.map((data) => {
        if (selectedNode.indexOf(data.source) != -1 || selectedNode.indexOf(data.target) != -1) {
          return (
            <g key={`${data.source},${data.target}`}>
              <line
                x1={xScale(posData[data.source_c].x)}
                x2={xScale(posData[data.target_c].x)}
                y1={height - yScale(posData[data.source_c].y)}
                y2={height - yScale(posData[data.target_c].y)}
                stroke="black"
              ></line>
            </g>
          );
        }
      })}
      {posData.map((data, index) => {
        return (
          <g
            key={data.id}
            transform={`translate(${xScale(data.x)},${height - yScale(data.y)
              })`}
            onClick={() => {
              updateSelectedNode(data.id);
            }}
          >
            <circle r={imageSize * 5} fill={selectedNode.indexOf(data.id) != -1 ? "lime" : "black"} />
            <image
              href={data.image}
              height={imageSize * 9}
              width={imageSize * 16}
              alt=""
              x={-imageSize * 16 / 2}
              y={-imageSize * 9 / 2}
              style={trimmingIcon(data.image, index, imageSize)}
            />
          </g>
        );
      })}
    </ZoomableSVG>
  );
}

export async function getStaticProps() {
  const fs = require("fs");
  const jsonData = JSON.parse(fs.readFileSync("./public/dota2Data.json"));
  const _posData = await request(jsonData);
  const _linksData = jsonData.getHeroCombinationWinLose;

  return {
    props: { _posData, _linksData },
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
    <svg ref={svgRef} viewBox="0 0 1200 1200">
      <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
    </svg>
  );
}
