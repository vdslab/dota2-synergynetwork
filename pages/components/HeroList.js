import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
export const HeroList = ({posData}) =>{
    const imageSize=4;
    return(
    <Box sx={{mt:3, overflow: 'visible', width:399, height:1000}}>
        <Grid container spacing={2}>
            {
                posData.map((element)=>{
                    return(
                        <img
                src={element.image}
                height={imageSize * 9}
                width={imageSize * 16}
                alt=""
                // style={trimmingIcon(data.image, index, imageSize)}
              />
                    )
                })
            }
        </Grid>
    </Box>

    )
}