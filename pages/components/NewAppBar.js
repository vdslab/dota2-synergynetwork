import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { useState } from "react";
import { FormControl, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import NorthWestIcon from '@mui/icons-material/NorthWest';
import MenuIcon from '@mui/icons-material/Menu';
import { DisplayData } from './DisplayData';
import { SelectHero } from './SelectHero';
import { HeroList } from './HeroList';
export const NewAppBar = ({ selectedNode, setSelectedNode, posData, _jsonData}) => {
  const [showValue, setShowValue] = useState("勝率差");
  const [menu, setMenu] = useState([400, 700]);
  const handleChange = (e) => {
    setShowValue(e.target.value)
  }
  const hideMenu = () => {
    setMenu([70, 70]);
  }
  const openMenu = () => {
    setMenu([400, 700]);
  }

  const MenuContents = () => {
    if (menu[0] == 400) {
      return (
        <div>
          <h1>Dota2 SynergyNetwork</h1>
          <Box sx={{
            margin: 1
          }}>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Data</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={showValue}
                label="data"
                onChange={handleChange}
              >
                <MenuItem value={"勝率差"}>勝率差</MenuItem>
                <MenuItem value={"使用率"}>使用率</MenuItem>
                <MenuItem value={"勝率差*使用率"}>勝率差*使用率</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <SelectHero hero={"hero1"} id={selectedNode[0]} posData={posData}/>
          <SelectHero hero={"hero2"} id={selectedNode[1]} posData={posData}/>
          
          <DisplayData selectedNode={selectedNode} setSelectedNode={setSelectedNode} posData={posData} _jsonData={_jsonData}/>
          <HeroList posData={posData}/>
          <IconButton position="absolute" size="large" style={{ left: 340, top: 190 }} onClick={hideMenu}>
            <NorthWestIcon fontSize="inherit" />
          </IconButton>
        </div>
      )
    } else {
      return (
        <IconButton position="absolute" size="large" style={{ left: 10, top: 10 }} onClick={openMenu}>
          <MenuIcon fontSize="inherit" />
        </IconButton>
      )
    }
  }
  return (
    <Box position="fixed" style={{ transition: "0.5s", overflow: "hidden", boxShadow: "5px 5px 5px rgba(0,0,0,0.25)", borderRadius: "2px" }} sx={{
      width: menu[0],
      height: menu[1],
      margin: 1,
      backgroundColor: "#FFFFFF"
    }}>
      <MenuContents />
    </Box>
  );
}

export default function Home() {
  return (<div></div>)
}