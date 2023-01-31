import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { request } from "./api/api";
import { NewAppBar } from "./components/NewAppBar.js";
import { trimmingIcon } from "./components/TrimmingIcon";
import { DisplayData } from "./components/DisplayData";

export default function Home({ _jsonData, _posData }) {
  const [posData, setPosData] = useState(_posData);
  const [linksdata, setLinksData] = useState(null);

  const [selectedNode, setSelectedNode] = useState([-1, -1]);
  const [activeHero, setActiveHero] = useState(_posData.map(() => { return 1; }));
  const [changeHero, setChangeHero] = useState(false);
  const [matchCountMinMax, setMatchCountMinMax] = useState([500, 10000]);
  const [winRateMinMax, setWinRateMinMax] = useState([0, 100]);

  const transAll = {}
  _posData.map((d) => {
    transAll[d.id.toString()] = d.c_id;
  })

  const trans = {};
  posData.map((d) => {
    trans[d.id.toString()] = d.c_id;
  })

  function updateLinksData() {
    setLinksData(_jsonData.getHeroCombinationWinLose.map((d) => {
      const sc = transAll[d.hero1.toString()];
      const tc = transAll[d.hero2.toString()];
      if (activeHero[sc] == 1 && activeHero[tc] == 1) {
        return (
          {
            source: d.hero1,
            target: d.hero2,
            source_c: trans[d.hero1.toString()],
            target_c: trans[d.hero2.toString()],
            win: d.win,
            lose: d.lose,
            count: d.count,
            winRate: d.winrate,
          }
        );
      }
    }).filter((e) => { return (e != undefined) }));
  }

  useEffect(() => {
    if (changeHero) {
      setLinksData(null);
      //console.log("acetiveHero");
      (async () => {
        const jsonData = {
          heroData: _jsonData.heroData.filter((e) => {
            return (activeHero[trans[e.id]] == 1);
          }),
          getHeroCombinationWinLose: _jsonData.getHeroCombinationWinLose.filter((e) => {
            return (activeHero[trans[e.hero1]] == 1 && activeHero[trans[e.hero2]] == 1);
          }),
        };
        const r = await request(jsonData);
        setPosData(r);
      })();
      setChangeHero(false);
    }
  }, [changeHero]);

  useEffect(() => {
    updateLinksData();
  }, [posData]);

  if (linksdata == null) {
    return (<div>読み込み中...</div>);
  }

  //return (<div></div>);

  return (
    <div>
      <NewAppBar
        posData={posData}
        _posData={_posData}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
        matchCountMinMax={matchCountMinMax}
        setMatchCountMinMax={setMatchCountMinMax}
        winRateMinMax={winRateMinMax}
        setWinRateMinMax={setWinRateMinMax}
        activeHero={activeHero}
        setActiveHero={setActiveHero}
        setChangeHero={setChangeHero}
      />
      <ScatterPlot
        posData={posData}
        linksData={linksdata}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
        matchCountMinMax={matchCountMinMax}
        winRateMinMax={winRateMinMax}
      />
    </div>
  );
}

function ScatterPlot({ posData, linksData, selectedNode, setSelectedNode, matchCountMinMax, winRateMinMax }) {
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

    if (index != -1) {
      //console.log("既に存在している場合:削除される");
      setSelectedNode(selectedNode.map((e, i) => {
        if (i == index) {
          return (-1);
        }
        return (e);
      }));
    } else if (count == 2) {
      //console.log("既に2つ選択していてさらに選択しようとしている場合:何も起こらない");
      //do nothing
    } else if (count == 0 || count == 1) {
      //console.log("新たに選択する場合:追加される");
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
  console.log(linksData);
  return (
    <ZoomableSVG width={width} height={height}>
      {linksData.map((data) => {
        const sourceIndex = selectedNode.indexOf(data.source);
        const targetIndex = selectedNode.indexOf(data.target);
        if (sourceIndex != -1 || targetIndex != -1) {
          if (winRateMinMax[0] <= data.winRate * 100 && data.winRate * 100 <= winRateMinMax[1] &&
            matchCountMinMax[0] <= data.count && data.count <= matchCountMinMax[1]) {
            let s = [xScale(posData[data.source_c].x), height - yScale(posData[data.source_c].y)];
            let t = [xScale(posData[data.target_c].x), height - yScale(posData[data.target_c].y)];

            if (sourceIndex != -1) {
              s = [xScale(posData[data.target_c].x), height - yScale(posData[data.target_c].y)];
              t = [xScale(posData[data.source_c].x), height - yScale(posData[data.source_c].y)];
            }

            const distance = ((s[0] - t[0]) ** 2 + (s[1] - t[1]) ** 2) ** (1 / 2);
            const w = 2;
            const pos1 = [s[0], s[1] + w];
            const pos2 = [s[0], s[1] - w];
            const pos3 = [s[0] + distance, s[1]];
            const arc = Math.atan2(t[1] - s[1], t[0] - s[0]) * 180 / Math.PI;
            return (
              <g key={`${data.source},${data.target}`}>
                <polygon points={`${pos1[0]} ${pos1[1]}, ${pos2[0]} ${pos2[1]}, ${pos3[0]} ${pos3[1]}`} transform={`rotate(${arc}, ${s[0]}, ${s[1]})`} />
              </g>
            );
          }
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
  const _jsonData = JSON.parse(fs.readFileSync("./public/dota2Data.json"));
  const _posData = await request(_jsonData);

  return {
    props: { _jsonData, _posData },
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
