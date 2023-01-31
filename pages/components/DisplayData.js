export const DisplayData = ({selectedNode, setSelectedNode, posData, _jsonData}) => {
    let displayIcons = []
    let win_rate=100

    if(selectedNode[0]!=-1&&selectedNode[1]!=-1){
        const combinationData=_jsonData.getHeroCombinationWinLose.find(element=>
            element.hero1==selectedNode[0]&&element.hero2==selectedNode[1]||
            element.hero1==selectedNode[1]&&element.hero2==selectedNode[0])
             win_rate=combinationData.winrate
    }
    const pick_rate="100"
    console.log("test")
    const imageSize=5
    return (
        <div>
            
        <svg>
            {
                selectedNode.map((element, index)=>{
                    if(element!=-1){
                        return(
                            <image
                href={posData[element].image}
                height={imageSize * 9}
                width={imageSize * 16}
                alt=""
                x={(imageSize * 16 / 2)*index*3}
                y={-imageSize * 9 / 2}
                // style={trimmingIcon(data.image, index, imageSize)}
              />
                        )
                    }
                })
                
            }
        </svg>
            <p>{win_rate}</p>
            <p>{pick_rate}</p>
        </div>
    );
}

export default function Home() {
    return (<div></div>)
}