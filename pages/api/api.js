export async function request(query) {
    const response = await fetch(`https://api.opendota.com/api/explorer?sql=${query}`);
    const json = await response.json();
    return json;
}

export async function getHeroCombinationWinLose() {
    // todo 以下にネットワークを構築するSQLを書く 既に書いてあるのは例 @高見
    return await request("SELECT hero1,hero2, cast(win AS REAL)/ CAST(count1 AS REAL) AS winRate FROM (SELECT table3.hero1,table3.hero2, COUNT(table3.radiant_win=true OR NULL) AS win, COUNT(table3.radiant_win=false OR NULL) AS lose,  COUNT(table3.table1ID) AS count1 FROM (SELECT tableA.match_id AS table1ID, tableB.match_id table2ID, matches.radiant_win, match_patch.patch, tableA.hero_id AS hero1, tableB.hero_id AS hero2 FROM picks_bans AS tableA INNER JOIN picks_bans AS tableB ON tableA.match_id = tableB.match_id INNER JOIN match_patch ON tableA.match_id = match_patch.match_id INNER JOIN matches ON matches.match_id = tableA.match_id where tableA.team = tableB.team AND match_patch.patch = '7.31' AND tableA.is_pick = true AND tableB.is_pick = true AND tableA.hero_id < tableB.hero_id ORDER BY tableA.match_id DESC limit 1000) AS table3 GROUP BY table3.hero1, table3.hero2 ORDER BY table3.hero1, table3.hero2) AS table7");
}

export async function getHeroData() {
    // todo 以下にネットワークを構築するSQLを書く 既に書いてあるのは例 @高見
    return await request("SELECT id, localized_name AS heroName FROM heroes ");
}