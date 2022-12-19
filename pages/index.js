import { getHeroCombinationWinLose } from "./api/api"

export default function Home(data) {
  console.log(data);
  return (
    <div>
      <h1>Dota2 SynergyNetwork</h1>
    </div>
  )
}
export async function getStaticProps() {
  console.log("getStaticProps");
  const data = await getHeroCombinationWinLose();
  return {
    props: { data },
  };
}