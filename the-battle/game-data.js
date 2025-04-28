const cardData = {
  HITTER: {
    MOVE_UP: "img/cards/hitter/MOVE_UP.png",
    MOVE_DOWN: "img/cards/hitter/MOVE_DOWN.png",
    MOVE_LEFT: "img/cards/hitter/MOVE_LEFT.png",
    MOVE_RIGHT: "img/cards/hitter/MOVE_RIGHT.png",
    GUARD: "img/cards/hitter/GUARD.png",
    POWER_SWING: "img/cards/hitter/POWER_SWING.png",
    GRAND_STEAL: "img/cards/hitter/GRAND_STEAL.png",
    GRAND_SLAM: "img/cards/hitter/GRAND_SLAM.png",
    BAT_STORM: "img/cards/hitter/BAT_STORM.png",
    ENERGY_UP: "img/cards/hitter/ENERGY_UP.png",
  },
  BUSTER: {
    MOVE_UP: "img/cards/buster/MOVE_UP.png",
    MOVE_DOWN: "img/cards/buster/MOVE_DOWN.png",
    MOVE_LEFT: "img/cards/buster/MOVE_LEFT.png",
    MOVE_RIGHT: "img/cards/buster/MOVE_RIGHT.png",
    GUARD: "img/cards/buster/GUARD.png",
    SUPER_WEIGHT: "img/cards/buster/SUPER_WEIGHT.png",
    MUSCLE_QUAKE: "img/cards/buster/MUSCLE_QUAKE.png",
    LEG_PRESS: "img/cards/buster/LEG_PRESS.png",
    FINAL_REPEAT: "img/cards/buster/FINAL_REPEAT.png",
    ENERGY_UP: "img/cards/buster/ENERGY_UP.png",
  }
};

const ATTACK_SKILLS = {
  //BUSTER
  SUPER_WEIGHT: "ATTACK-456-40-30",
  MUSCLE_QUAKE: "ATTACK-1345679-10-20",
  FINAL_REPEAT: "ATTACK-258-50-50",
  LEG_PRESS: "ATTACK-5789-25-20",

  //HITTER
  POWER_SWING: "ATTACK-1235-50-50",
  GRAND_STEAL: "ATTACK-2468-15-15",
  GRAND_SLAM: "ATTACK-24568-40-50",
  BAT_STORM: "ATTACK-12346789-20-35"
}


const CHARACTERS = {
  BUSTER: {
    attackCards: [
      "SUPER_WEIGHT",
      "MUSCLE_QUAKE",
      "FINAL_REPEAT",
      "LEG_PRESS"
    ]
  },
  HITTER: {
    attackCards: [
      "POWER_SWING",
      "GRAND_STEAL",
      "GRAND_SLAM",
      "BAT_STORM"
    ]
  }
};

const CHAR_NAMES = {
  BUSTER: "MAX BUSTER",
  HITTER: "JOHNNY HITTER",
  // BLOODSAIL: "KARMA BLOODSAIL"
};

const MINI_IMG = {
  BUSTER: "img/char/buster/buster-head-l.png",
  HITTER: "img/char/hitter/hitter-head-l.png"
}
