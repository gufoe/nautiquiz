import { QUIZZES, VELAQUIZZES } from './src/data/quiz';
const baseIds = [1074,111,639,316,841,283,1197,614,662,737,799,752,654,898,938,420,626,280,160,1289,586,658,40,583,653,688,1206,199,758,742,759,744,831,599,1181,464,300,1386,642,1259,696,288,161,956,1394];
const velaIds = [183,23,227,204];
function dump(label: string, arr: any[], ids: number[]) {
  console.log(`== ${label} ==`);
  for (const id of ids) {
    const q = arr.find((x) => x.id === id);
    console.log(JSON.stringify(q));
  }
}
dump('BASE', QUIZZES, baseIds);
dump('VELA', VELAQUIZZES, velaIds);
