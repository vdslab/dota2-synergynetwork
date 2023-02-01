import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Image from 'next/image'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export const HeroList = ({ _posData, activeHero, setActiveHero, setChangeHero }) => {
    const imageSize = 4;
    return (
        <Box sx={{ overflow: 'auto', width: 399, height: 1000 }}>
            <Box sx={{ mt: 1, mb: 4, ml: 2 }}>
                <Stack spacing={2} direction="row">
                    <Button variant="contained" onClick={() => { setChangeHero(true) }}>Submit</Button>
                    <Button variant="contained" onClick={() => { setActiveHero(activeHero.map(() => { return (1) })) }}>AllActive</Button>
                    <Button variant="contained" onClick={() => { setActiveHero(activeHero.map(() => { return (0) })) }}>AllNonActive</Button>
                </Stack>
            </Box>


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
    return (<div></div>)
}