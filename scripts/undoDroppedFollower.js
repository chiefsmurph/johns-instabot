// use when daily cron stops short and acts like these people arent really following you anymore even though they are
const followUser = require('../actions/singles/followUser');

const initApp = require('../helpers/initApp');
const handleManager = require('../modules/handleManager');

(async () => {

  console.log(handleManager);

  const { browser, cookies } = await initApp();

  const undoDroppedFollowers = [ 'john_jiggs',
  'fd045',
  'lauren4factory',
  'stevdelros_',
  'lydiapumpkin',
  'trashandlens',
  'trendculprit',
  'coachduran',
  'naxcivan_meyxana',
  'sammy_blackwolf',
  '_lost.in.aesthetics_',
  'soinsbarbe',
  'blackrabbit_gothic',
  'lei_eldridge',
  'flywear101',
  'k2klwa',
  'awek_seksi97',
  'el_moisto_sauces',
  'tom_talks_thrift',
  'jk_1437',
  'sixty_six_officialstreetwear',
  'fuhggedaboutit',
  'toxic_pikachu',
  'tallchildrenmusic',
  'jaycreative_',
  'carapiccolanimue',
  'shauwnknight',
  'mad_hipster',
  'qim.my',
  'emperor_of_the_night',
  'bcme_the_lgnd',
  'wealthyclubpromo',
  'handandgrain',
  'meukowcognac',
  'avk17_',
  'mrthinkbigandstandtall',
  'ciknisriinabalqis',
  'kiyara_callaa',
  'toihanter',
  'ryanacra',
  'quartermoonvintage',
  'genreurbanarts',
  'fahmistore.co_01',
  'campcandlecampcandle',
  'brokenswans',
  'earlymorningskyofficial',
  'jewelry__baku',
  'sophiewortleymakeup',
  'jb.hipster',
  'aesthetic._xx',
  'crash.rush.band',
  'deascoiffure',
  'just.great.music',
  'mohitverma5005',
  'alexk.ph',
  'lilmurdah_btdceo',
  'alba.cerezo',
  'bandacornerstone',
  '_bloosssom_',
  'please_follow_biio',
  'wolfpoetsband',
  'serien_zitate.de',
  'mic2u',
  'mariana_nichifor',
  'mommyssidegig',
  'carcrashgirlfriend',
  'kennethmusiclover_official',
  'iconshaw',
  'sweetlovers_official_',
  '8199entertainment',
  'lonelyboysmovie',
  'anotheryeartogether',
  'sunminds_',
  'flamigas',
  'hrtz_in',
  'piercethecori',
  'mohamad_izzan_67_',
  'gallolivia',
  'angelomassucco',
  'ozouoo',
  'pearl_jp',
  'piero__maida',
  'heart_hacker_2k',
  'sp__prem',
  'skowt.it',
  'baby.vanashop',
  '4u1direction',
  '69_bet',
  'p3achy121',
  'oppositefanship',
  'lacantina27',
  'ctotophelgs',
  'angelace',
  'marienhouston',
  'clarkkaettano',
  'viktoria_kykol',
  'brennandaniel' ];

  const dateWithinPastSevenDays = date => {
    var today = new Date();
    var pastWeek = Date.parse(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7));
    return (Date.parse(date) > pastWeek);
  };

  for (let username of undoDroppedFollowers) {
    console.log(username);
    const foundHandle = handleManager.getHandle(username);
    if (foundHandle) {
      console.log('foundHandle', foundHandle);
      // undo neverfollow and unfollowedyouon
      await handleManager.deleteKeys(username, ['neverfollow', 'unfollowedyouon']);
      await handleManager.mergeAndSave(username, {
        followsyou: true
      });
      // for those peeps that you unfollowed refollow and delete youunfollowedthemon
      if (foundHandle.youunfollowedthemon && dateWithinPastSevenDays(foundHandle.youunfollowedthemon)) {
        console.log('check this out: ');
        console.log(foundHandle, username);

        await followUser(username, cookies, browser);
        await handleManager.deleteKeys(username, ['youunfollowedthemon']);
      }
    } else {
      console.log('could not find handle', username);
    }
  }


})();
