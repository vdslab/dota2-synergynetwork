import Select from "react-select";
import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { useState } from "react";
import { FormControl, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { HeroListDrawer } from "./HeroListDrawer";
import { TextField } from "@mui/material";
export function NewAppBar({
  posData,
  _posData,
  selectedNode,
  setSelectedNode,
  matchCountMinMax,
  setMatchCountMinMax,
  winRateMinMax,
  setWinRateMinMax,
  activeHero,
  setActiveHero,
  setChangeHero
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

  const handleHeroListDrawerOpen = () => {
    setHeroListOpen(true);
  }

  const handleHeroListDrawerClose = () => {
    setHeroListOpen(false);
  }

  const [open, setOpen] = React.useState(false);
  const [heroListOpen, setHeroListOpen] = React.useState(false);

  const theme = useTheme();
  const selectStyles = {
    control: (styles) => ({ ...styles, margin: "1rem" }),
    option: (styles) => {
      return {
        ...styles,
      };
    },
  };
  const DrawerHeader = styled("div")(({ theme }) => ({
    background: "#1976d2",
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));
  return (
    <Box
      sx={{ display: "flex", border: "1px solid" }}
      border={4}
      borderColor="primary.main"
    >
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
          <Typography variant="h5" noWrap component="div" sx={{ marginLeft: "auto", marginRight: "auto" }}>
            Dota2 SynergyNetwork
          </Typography>
        </Toolbar>
      </AppBar>
      <HeroListDrawer
        heroListOpen={heroListOpen}
        handleHeroListDrawerClose={handleHeroListDrawerClose}
        _posData={_posData}
        activeHero={activeHero}
        setActiveHero={setActiveHero}
        setChangeHero={setChangeHero}
      />
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
          <MinMax
            mm={matchCountMinMax}
            setmm={setMatchCountMinMax}
            text={"試合数"}
          />
          <MinMax mm={winRateMinMax} setmm={setWinRateMinMax} text={"勝率"} />
          <Select
            placeholder="hero1"
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
            styles={selectStyles}
          />
          <Select
            placeholder="hero2"
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
            styles={selectStyles}
          />
        </FormControl>
      </Drawer>
    </Box>
  );
}

function MinMax({ mm, setmm, text }) {
  return (
    <div>
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{ marginTop: "2rem" }}
      >
        {text}
      </Typography>
      <TextField
        id="outlined-basic"
        label="最小値"
        variant="outlined"
        type={"number"}
        value={mm[0]}
        onChange={(event) => setmm([event.target.value, mm[0]])}
        sx={{ marginTop: "1rem" }}
      />
      <TextField
        id="outlined-basic"
        label="最大値"
        variant="outlined"
        type={"number"}
        value={mm[1]}
        onChange={(event) => setmm([event.target.value, mm[1]])}
        sx={{ marginTop: "1rem" }}
      />
    </div>
  );
}

export default function Home() {
  return <div></div>;
}
