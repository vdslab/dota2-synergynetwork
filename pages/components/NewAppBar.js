import { useState } from "react";
import { FormControl, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import NorthWestIcon from '@mui/icons-material/NorthWest';
import MenuIcon from '@mui/icons-material/Menu';
import { DisplayData } from './DisplayData';

import React from 'react'
import Select from 'react-select'


export function NewAppBar({ posData, selectedNode, setSelectedNode, matchCountMinMax, setMatchCountMinMax, winRateMinMax, setWinRateMinMax }) {
  const heros = posData.map((e) => {
    return (
      {
        value: e.id,
        label: e.heroname,
      }
    );
  })

  const menuX = 450, menuY = 400;

  const [menu, setMenu] = useState([menuX, menuY]);
  const hideMenu = () => {
    setMenu([70, 70]);
  }
  const openMenu = () => {
    setMenu([menuX, menuX]);
  }

  return (
    <Box position="fixed" style={{ transition: "0.5s", overflow: "hidden", boxShadow: "5px 5px 5px rgba(0,0,0,0.25)", borderRadius: "2px" }} sx={{
      width: menu[0],
      height: menu[1],
      margin: 1,
      backgroundColor: "#FFFFFF"
    }}>
      <FormControl>
        <Select
          value={selectedNode[0] == -1 ? null : heros.find((e) => { return (e.value == selectedNode[0]) })}
          options={heros} onChange={(value) => setSelectedNode([value.value, selectedNode[1]])}
        />
        <Select
          value={selectedNode[1] == -1 ? null : heros.find((e) => { return (e.value == selectedNode[1]) })}
          options={heros} onChange={(value) => setSelectedNode([selectedNode[0], value.value])}
        />
        <MinMax mm={matchCountMinMax} setmm={setMatchCountMinMax} text={"試合数"} />
        <MinMax mm={winRateMinMax} setmm={setWinRateMinMax} text={"勝率"} />
      </FormControl>
    </Box>
  );
}

function MinMax({ mm, setmm, text }) {
  return (
    <div>
      <input
        type={"number"}
        value={mm[0]}
        onChange={(event) => setmm([event.target.value, mm[1]])}
      />
      {" <= " + text + " <= "}
      <input
        type={"number"}
        value={mm[1]}
        onChange={(event) => setmm([mm[0], event.target.value])}
      />
    </div>
  );
}

export default function Home() {
  return (<div></div>)
}