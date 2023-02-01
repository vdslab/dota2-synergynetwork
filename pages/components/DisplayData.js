import Grid from '@mui/material/Grid'
import Select from "react-select";
import { Box } from '@mui/system'
import Image from 'next/image'
import { styled, useTheme } from "@mui/material/styles";
import { Stack } from '@mui/material';

export const DisplayData = ({ selectedNode, setSelectedNode, posData, _jsonData, heros }) => {
    let displayIcons = []
    let win_rate = null
    let match_count = null
    let text = " "
    let pickText = " "
    const theme = useTheme();
  const selectStyles = {
    control: (styles) => ({ ...styles, margin: "1rem" }),
    option: (styles) => {
      return {
        ...styles,
      };
    },
  };
    if (selectedNode[0] != -1 && selectedNode[1] != -1 && selectedNode[0] != selectedNode[1]) {
        const combinationData = _jsonData.getHeroCombinationWinLose.find(element =>
            element.hero1 == selectedNode[0] && element.hero2 == selectedNode[1] ||
            element.hero1 == selectedNode[1] && element.hero2 == selectedNode[0])
        win_rate = combinationData.winrate
        match_count = combinationData.count
        text = "勝率:"
        pickText = "試合数:"
    }
    const imageSize = 10
    return (
        <Box sx={{ flexGrow: 1, pl: 3, pt: 5 }}>
            <Grid container spacing={2}>
                {
                    selectedNode.map((element, index) => {
                        if (element != -1) {
                            return (
                                <Grid item key={index}>
                                    <Image
                                        src={posData.find((e) => { return (e.id == element) }).image}
                                        height={imageSize * 9}
                                        width={imageSize * 16}
                                        alt=""
                                        x={(imageSize * 16 / 2) * index * 3}
                                        y={-imageSize * 9 / 2}
                                    // style={trimmingIcon(data.image, index, imageSize)}
                                    />
                                </Grid>
                            )
                        }else{
                          return(<div style={{width:imageSize*16, height:imageSize*9}}></div>)
                        }
                    })

                }
            </Grid>
            <Stack direction="row" spacing={2}>
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
          </Stack>
            <h3>{text}{win_rate ? (Math.round(win_rate * 1000) / 10) : ""}{"%"}</h3>
            <h3>{pickText}{ match_count ? match_count : ""}{"試合"}</h3>

        </Box>
    );
}

export default function Home() {
    return (<div></div>)
}