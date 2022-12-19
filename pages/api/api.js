export async function request(query) {
    const response = await fetch(`https://api.opendota.com/api/explorer?sql=${query}`);
    const json = await response.json();
    return json;
}

export async function getHeroCombinationWinLose() {
    // todo 以下にネットワークを構築するSQLを書く 既に書いてあるのは例 @高見
    return await request("select * from picks_bans limit 1;");
}