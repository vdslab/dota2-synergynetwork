import { getHeroCombinationWinLose } from "./api/api"

export default function Home(data) {
  console.log(data);
  return (
    <div>
      <h1>Dota2 SynergyNetwork</h1>
      <div>
        <h2>HeroSynergyNetwork</h2>
        <Network data={data} />
      </div>
    </div>
  )
}

function Network(data) {
  // todo ここにネットワークを描画するコードを書く @樋口
  // dataは高見が取ってきたjsonデータ
  return (<div>
    ネットワーーーークの描画
  </div>);
}

export async function getStaticProps() {
  console.log("getStaticProps");
  const data = await getHeroCombinationWinLose();
  return {
    props: { data },
  };
}