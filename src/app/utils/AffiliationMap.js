const map = {
    //steemit
    elipowell: 'Steemit',
    steemitblog: 'Steemit',
    steemitdev: 'Steemit',
    //hive
    hiveio: 'hive',

    // Add Custom Badges. Use single quotes for the key if user has . or -,  e.g.
    // 'robot.pay' : 'Robot',

    //battlegames
    battlegames: 'Tribe Account',
    agr8buzz: 'Sparklepuff',
    battletoken: 'Tip Bot',
    rentmoney: 'Verified Creator',
    wiriwiri: 'Verified Creator',
    dkid14: 'Verified Creator',
    'anouk.nox.spt': 'Verified Creator',
    kaelci: 'Verified Creator',
    mickvir: 'Verified Creator',
    thegoliath: 'Verified Creator',
    freddbrito: 'Verified Creator',
    philippekiene: 'Verified Creator',
    atnazo: 'Verified Creator',
    'zaku-spt': 'Verified Creator',
    radaquest: 'Verified Creator',
    jodipamungkas: 'Verified Creator',
    sharmlock: 'Verified Creator',
    dirapa: 'Verified Creator',
    julisavio: 'Verified Creator',
    voxmortis: 'Verified Creator',
    ahmadmanga: 'Verified Creator',
    marianaemilia: 'Verified Creator',
    simplegame: 'Verified Creator',
    'splinterlands-ru': 'Verified Creator',
    flauwy: 'Verified Creator',
    rehan12: 'Verified Creator',
};

export function affiliationFromStake(accountName, stake) {
    // Put stake based breakdowns here.
    return map[accountName];
}

export default map;
