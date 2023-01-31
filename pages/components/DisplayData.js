import Grid from '@mui/material/Grid'
import { Box } from '@mui/system'
import Image from 'next/image'

export const DisplayData = ({ selectedNode, posData, _jsonData }) => {
    let displayIcons = []
    let win_rate = null
    let match_count = null
    let text = " "
    let pickText = " "
    if (selectedNode[0] != -1 && selectedNode[1] != -1) {
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
                                <Grid item key={element}>
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
                        }
                    })

                }
            </Grid>
            <h3>{text}{win_rate ? (Math.round(win_rate * 1000) / 10) : ""}{"%"}</h3>
            <h3>{pickText}{ match_count ? match_count : ""}{"試合"}</h3>

        </Box>
    );
}

export default function Home() {
    return (<div></div>)
}