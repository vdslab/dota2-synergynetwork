export async function request(query) {
    const response = await fetch(`https://api.opendota.com/api/explorer?sql=${query}`);
    const json = await response.json();
    return json;
}

export async function getHeroCombinationWinLose() {
    // todo 以下にネットワークを構築するSQLを書く 既に書いてあるのは例 @高見
    const records = await getMatchCount();
    let recordCount = 0;
    recordCount = records.rows[0].count;
    console.log("count"+recordCount);
    const oneTimeAmount = 1000;
    let num = 0;
    var array = [];
    while( num <= recordCount){
        const data = await getRecords(num, oneTimeAmount);
        await sleep(1000);
        if(data.rows){
            array.push(...data.rows);
            console.log(num+"="+data.rows[0]);
            console.log(num+"="+data.rows.length);
        }else{
            console.log(num+"="+"miss"+data);
        }
        num+=oneTimeAmount;
    }
    await compileData(array);
    await calcWin_rate(array);
    if(!array){
        array = [];
    }
    var response = {rows: array}
    console.log(response);
    return  response;
}

export async function calcWin_rate(array){
    console.log(array[0]);
    array.forEach( (obj)=>{ obj.winrate = obj.win/obj.count} ); 
}

export async function getRecords(start, end) {
    // todo 以下にネットワークを構築するSQLを書く 既に書いてあるのは例 @高見
    let response = null;
    for(let i = 0; i < 10; i++ ){
        response = await request(`SELECT table3.hero1,table3.hero2, COUNT(table3.radiant_win=true OR NULL) AS win, COUNT(table3.radiant_win=false OR NULL) AS lose,  COUNT(table3.table1ID) FROM (SELECT tableA.match_id AS table1ID, tableB.match_id table2ID, matches.radiant_win, tableA.hero_id AS hero1, tableB.hero_id AS hero2 FROM (SELECT picks_bans.match_id, picks_bans.hero_id, picks_bans.is_pick,picks_bans.team, match_patch.patch FROM picks_bans, match_patch WHERE picks_bans.match_id = match_patch.match_id AND match_patch.patch = '7.31' ORDER BY picks_bans.match_id DESC LIMIT ${end} OFFSET ${start}) AS tableA INNER JOIN (SELECT picks_bans.match_id, picks_bans.hero_id, match_patch.patch ,picks_bans.is_pick, picks_bans.team FROM picks_bans, match_patch WHERE picks_bans.match_id = match_patch.match_id AND match_patch.patch = '7.31' ORDER BY picks_bans.match_id DESC LIMIT ${end} OFFSET ${start}) AS tableB ON tableA.match_id = tableB.match_id INNER JOIN matches ON matches.match_id = tableA.match_id where tableA.team = tableB.team  AND tableA.is_pick = true AND tableB.is_pick = true AND tableA.hero_id < tableB.hero_id ORDER BY tableA.match_id DESC) AS table3 GROUP BY table3.hero1, table3.hero2 ORDER BY table3.hero1, table3.hero2
        `);
        if(response.rows){
            break;
        }
        console.log(response);
        await sleep(10000);
    }
    return response;
    
}

export async function compileData(array) {
    var new_array = array.reduce(function(result, current){
        var obj = result.find(function(element) { return current.hero1 == element.hero1 && current.hero2 == element.hero2});
        if(obj){
            obj.win = obj.win + current.win;
            obj.lose = obj.lose + current.lose;
            obj.count = obj.count + current.count;
        }else{
            const data2 = {
                hero1: current.hero1,
                hero2: current.hero2,
                win: current.win,
                lose: current.lose,
                count: current.count
            }
            result.push(data2);
        }
        return result;
        
    },[]) 
    return new_array;
}

export async function getMatchCount() {
    return await request("SELECT COUNT(*) FROM (SELECT * FROM  matches INNER JOIN  match_patch ON matches.match_id = match_patch.match_id AND match_patch.patch = '7.31'  ORDER BY matches.match_id DESC) AS table1");
}

export async function getHeroData() {
    // todo 以下にネットワークを構築するSQLを書く 既に書いてあるのは例 @高見
    return await request("SELECT id, localized_name AS heroName FROM heroes ");
}

function sleep(s){
    return new Promise(function(resolve){
        setTimeout(function(){resolve()},s)
    })
}