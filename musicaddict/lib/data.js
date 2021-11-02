'use strict'


// save game storage
APP.DATA.storage = window.localStorage

// game options
APP.DATA.game = {
    loop_interval: 5_000, // int millisec
    discovery_interval: 30_000, // int millisec
    offer_interval: 30_000, // int millisec
    autosave_interval: 180_000, // int millisec
    listen_min: 5_000, // int millisec
    listen_max: 30_000, // int millisec
    record_collection_max: 1_000,
    log_length_max: 500, // int 1 - ...
    curs: '&#9672;', // str any
}

// APP.DATA.ram and APP.DATA.game are used as save game data:
// remember to change APP.version_storage if making changes here

// temporary game state/variables
APP.DATA.ram  = {
    game_start_time: null,
    last_save: null,
    next_tick_action: null,
    random_record: null,
    bulk_sale: null,
    last_discovery: null,
    last_offer: null,
    listen_start: null,
    listen_duration: null,
}

// initial character data
APP.DATA.char = {
    cash: 7,
    records: [],
    records_discovered: 0,
    records_bought: 0,
    records_sold: 0,
    offers_received: 0,
    total_spent: 0,
    total_earned: 0,
    trade_profit: 0,
}
