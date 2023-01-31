import * as React from "react";
import { DisplayData } from "./DisplayData";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { useState } from "react";
<<<<<<< HEAD
import { FormControl, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { HeroListDrawer } from "./HeroListDrawer";
export function NewAppBar({
  posData,
  selectedNode,
  setSelectedNode,
  matchCountMinMax,
  setMatchCountMinMax,
  winRateMinMax,
  setWinRateMinMax,
}) {
  const heros = posData.map((e) => {
    return {
      value: e.id,
      label: e.heroname,
    };
  });
  const [menu, setMenu] = useState([400, 400]);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleHeroListDrawerOpen = () =>{
    setHeroListOpen(true);
  }

  const handleHeroListDrawerClose = () =>{
    setHeroListOpen(false);
=======
import { FormControl, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import NorthWestIcon from '@mui/icons-material/NorthWest';
import MenuIcon from '@mui/icons-material/Menu';
import { DisplayData } from './DisplayData';
import { SelectHero } from './SelectHero';
import { HeroList } from './HeroList';
export const NewAppBar = ({ selectedNode, setSelectedNode, posData, _jsonData}) => {
  const [showValue, setShowValue] = useState("勝率差");
  const [menu, setMenu] = useState([400, 1000]);
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
>>>>>>> feature/display
  }

  const [open, setOpen] = React.useState(false);
  const [heroListOpen, setHeroListOpen] = React.useState(false);

  const theme = useTheme();
  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleHeroListDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div">
            Dota2 SynergyNetwork
          </Typography>
        </Toolbar>
      </AppBar>
      <HeroListDrawer heroListOpen={heroListOpen} handleHeroListDrawerClose={handleHeroListDrawerClose}/>
      <Drawer
        sx={{
          width: menu[0],
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: menu[0],
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Data</InputLabel>

          <Select
            value={
              selectedNode[0] == -1
                ? null
                : heros.find((e) => {
                    return e.value == selectedNode[0];
                  })
            }
            options={heros}
            onChange={(value) =>
              setSelectedNode([value.value, selectedNode[1]])
            }
          />
          <Select
            value={
              selectedNode[1] == -1
                ? null
                : heros.find((e) => {
                    return e.value == selectedNode[1];
                  })
            }
            options={heros}
            onChange={(value) =>
              setSelectedNode([selectedNode[0], value.value])
            }
          />
          <MinMax
            mm={matchCountMinMax}
            setmm={setMatchCountMinMax}
            text={"試合数"}
          />
          <MinMax mm={winRateMinMax} setmm={setWinRateMinMax} text={"勝率"} />
        </FormControl>
      </Drawer>
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
  return <div></div>;
}
