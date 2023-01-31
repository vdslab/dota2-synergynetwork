import Drawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { HeroList } from "./HeroList"
import { styled, useTheme } from "@mui/material/styles";
import { FormControl, IconButton } from "@mui/material";

export const HeroListDrawer = ({ heroListOpen, handleHeroListDrawerClose, _posData, activeHero, setActiveHero, setChangeHero }) => {
  const theme = useTheme();
  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));
  return (
    <Drawer
      sx={{
        width: 400,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 400,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={heroListOpen}
    >
      <DrawerHeader>
        <IconButton onClick={handleHeroListDrawerClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <HeroList
        _posData={_posData}
        activeHero={activeHero}
        setActiveHero={setActiveHero}
        setChangeHero={setChangeHero}
      />
    </Drawer>
  )
}

export default function Home() {
  return <div></div>
}