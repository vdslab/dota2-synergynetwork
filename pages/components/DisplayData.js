export const DisplayData = ({selectedNode, setSelectedNode, posData}) => {
    let displayIcons = []
    
    console.log("test")
    const imageSize=5
    return (
        <svg>
            {
                selectedNode.map((element)=>{
                    if(element!=-1){
                        return(
                            <image
                href={posData[element].image}
                height={imageSize * 9}
                width={imageSize * 16}
                alt=""
                x={-imageSize * 16 / 2}
                y={-imageSize * 9 / 2}
                // style={trimmingIcon(data.image, index, imageSize)}
              />
                        )
                    }
                })
                
            }
        </svg>
    );
}

export default function Home() {
    return (<div></div>)
}