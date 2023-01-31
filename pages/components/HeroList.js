import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import { active } from "d3";
import Image from 'next/image'

export const HeroList = ({ _posData, activeHero, setActiveHero, setChangeHero }) => {
    const imageSize = 8;
    return (
        <Box sx={{ overflow: 'auto', width: 399, height: 1000 }}>
            <button onClick={() => { setChangeHero(true) }}>
                button
            </button>
            <Grid container spacing={2}>
                {
                    _posData.map((e) => {
                        return (
                            <Image
                                key={e.id}
                                src={e.image}
                                height={imageSize * 9}
                                width={imageSize * 16}
                                alt=""
                                style={{ "opacity": activeHero[e.c_id] == 1 ? 1 : 0.3 }}
                                onClick={() => {
                                    setActiveHero(activeHero.map((h, i) => {
                                        if (i == e.c_id) {
                                            return h * -1;
                                        }
                                        return h;
                                    }))
                                }}
                            />
                        )
                    })
                }
            </Grid>
        </Box>
    )
}

export default function Home() {
    return <div></div>
}