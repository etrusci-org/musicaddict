'use strict'


APP.LIB.game = {
    loop_id: null,

    tick_action: {
        digging: () => {
            let next = ['digging']

            if (!APP.DATA.ram.last_offer) APP.DATA.ram.last_offer = Date.now();
            if (APP.DATA.char.records.length > 0 && (Date.now() - APP.DATA.ram.last_offer) > APP.DATA.game.offer_interval) {
                next.push('offer')
            }

            if (APP.DATA.char.cash < 1) {
                APP.UI.set_e('log', `broke, once again`, 'broke')
                APP.UI.set_e('log_img', 'broke')
            }
            else {
                if (APP.DATA.char.records.length > APP.DATA.game.record_collection_max) {
                    next = ['bulk_sale']

                    APP.UI.set_e('log', `you can not store any more records in your flat and decide to sell some on the marketplace`, 'toomanyrecords')
                    APP.UI.set_e('log_img', 'toomanyrecords')
                }
                else {
                    if (!APP.DATA.ram.last_discovery) APP.DATA.ram.last_discovery = Date.now();
                    if ((Date.now() - APP.DATA.ram.last_discovery) > APP.DATA.game.discovery_interval) {
                        next.push('discover')
                    }

                    APP.UI.set_e('log', `digging for cool records`, 'digging')
                    APP.UI.set_e('log_img', 'digging')
                }
            }

            APP.DATA.ram.next_tick_action = APP.LIB.random.array_item(next)
        },
        bulk_sale: () => {
            let next = ['bulk_sell']

            APP.DATA.ram.bulk_sale = Math.floor(APP.DATA.char.records.length * 0.3)

            APP.DATA.ram.next_tick_action = APP.LIB.random.array_item(next)
        },
        bulk_sell: () => {
            let next = ['bulk_sell']

            if (APP.DATA.ram.bulk_sale <= 0) {
                next = ['digging']
            }
            else {
                let record = APP.DATA.char.records.pop()

                let sell_price = APP.LIB.random.integer(record.price + 1, Math.floor(record.price * 1.5))
                let profit = sell_price - record.price

                APP.DATA.char.records_sold += 1
                APP.DATA.char.cash += sell_price
                APP.DATA.char.total_earned += sell_price

                APP.UI.set_e('log', `sold <span class="record">${record.artist} - ${record.title} [${record.format}]</span> for <span class="price">${sell_price}${APP.DATA.game.curs}</span> (<span class="price">${profit}${APP.DATA.game.curs}</span> profit)`, 'sell')
                APP.UI.set_e('log_img', 'sell')

                APP.DATA.ram.bulk_sale -= 1
            }

            APP.DATA.ram.next_tick_action = APP.LIB.random.array_item(next)
        },
        discover: () => {
            let next = ['listen']

            APP.DATA.ram.random_record = APP.LIB.random.record()

            APP.UI.set_e('log', `discovered <span class="record">${APP.DATA.ram.random_record.artist} - ${APP.DATA.ram.random_record.title} [${APP.DATA.ram.random_record.format}]</span>`, 'discover')
            APP.UI.set_e('log_img', 'discover')

            APP.DATA.char.records_discovered += 1
            APP.DATA.ram.last_discovery = Date.now()
            APP.DATA.ram.next_tick_action = APP.LIB.random.array_item(next)
        },
        listen: () => {
            let next = ['listen']

            if (!APP.DATA.ram.listen_start) {
                APP.DATA.ram.listen_start = Date.now()
                APP.DATA.ram.listen_duration = APP.LIB.random.integer(APP.DATA.game.listen_min, APP.DATA.game.listen_max)
            }

            if (Date.now() - APP.DATA.ram.listen_start > APP.DATA.ram.listen_duration) {
                next = ['buy', 'skip_buy']
                APP.DATA.ram.listen_start = null
                APP.DATA.ram.last_discovery = null
                APP.DATA.ram.last_offer = null
            }

            APP.UI.set_e('log', `listening`, 'listen')
            APP.UI.set_e('log_img', 'listen')

            APP.DATA.ram.next_tick_action = APP.LIB.random.array_item(next)
        },
        buy: () => {
            let next = ['digging']

            if (APP.DATA.char.cash < APP.DATA.ram.random_record.price) {
                APP.UI.set_e('log', `you want it, but do not have enough cash (need <span class="price">${APP.DATA.ram.random_record.price}${APP.DATA.game.curs}</span>)`, 'needmorecash')
                APP.UI.set_e('log_img', 'needmorecash')
            }
            else {
                APP.DATA.char.records_bought += 1
                APP.DATA.char.cash -= APP.DATA.ram.random_record.price
                APP.DATA.char.total_spent += APP.DATA.ram.random_record.price
                APP.DATA.char.records.push(APP.DATA.ram.random_record)

                APP.UI.set_e('log', `bought it for <span class="price">${APP.DATA.ram.random_record.price}${APP.DATA.game.curs}</span>`, 'buy')
                APP.UI.set_e('log_img', 'buy')
            }

            APP.DATA.ram.next_tick_action = APP.LIB.random.array_item(next)
        },
        skip_buy: () => {
            let next = ['digging']

            APP.UI.set_e('log', `nah, you don't like it that much`, 'skip_buy')
            APP.UI.set_e('log_img', 'skip_buy')

            APP.DATA.ram.next_tick_action = APP.LIB.random.array_item(next)
        },
        offer: () => {
            let next = ['sell', 'skip_sell']

            APP.DATA.ram.random_record = APP.DATA.char.records[APP.DATA.char.records.length-1]

            APP.UI.set_e('log', `someone wants to buy <span class="record">${APP.DATA.ram.random_record.artist} - ${APP.DATA.ram.random_record.title} [${APP.DATA.ram.random_record.format}]</span>`, 'offer')
            APP.UI.set_e('log_img', 'offer')

            APP.DATA.char.offers_received += 1
            APP.DATA.ram.last_offer = Date.now()
            APP.DATA.ram.next_tick_action = APP.LIB.random.array_item(next)
        },
        sell: () => {
            let next = ['digging']

            let sell_price = APP.LIB.random.integer(APP.DATA.ram.random_record.price + 1, Math.floor(APP.DATA.ram.random_record.price * 1.5))

            let profit = sell_price - APP.DATA.ram.random_record.price

            APP.DATA.char.records_sold += 1
            APP.DATA.char.cash += sell_price
            APP.DATA.char.total_earned += sell_price
            APP.DATA.char.records.pop()

            APP.UI.set_e('log', `sold it for <span class="price">${sell_price}${APP.DATA.game.curs}</span> (<span class="price">${profit}${APP.DATA.game.curs}</span> profit)`, 'sell')
            APP.UI.set_e('log_img', 'sell')

            APP.DATA.ram.next_tick_action = APP.LIB.random.array_item(next)
        },
        skip_sell: () => {
            let next = ['digging']

            APP.UI.set_e('log', `nah, you keep it for now`, 'skip_sell')
            APP.UI.set_e('log_img', 'skip_sell')

            APP.DATA.ram.next_tick_action = APP.LIB.random.array_item(next)
        },
    },

    loop_tick: () => {
        if (!APP.DATA.ram.last_save) APP.DATA.ram.last_save = Date.now()
        if ((Date.now() - APP.DATA.ram.last_save) > APP.DATA.game.autosave_interval) {
            APP.LIB.storage.save()
        }

        APP.DATA.char.trade_profit = APP.DATA.char.total_earned - APP.DATA.char.total_spent

        APP.UI.on_tick()

        if (!APP.DATA.ram.next_tick_action) APP.DATA.ram.next_tick_action = 'digging';
        APP.LIB.game.tick_action[`${APP.DATA.ram.next_tick_action}`]()
    },

    play: () => {
        if (APP.LIB.game.loop_id) return
        if (!APP.DATA.ram.game_start_time) APP.DATA.ram.game_start_time = Date.now()
        APP.LIB.game.loop_tick()
        APP.LIB.game.loop_id = setInterval(APP.LIB.game.loop_tick, APP.DATA.game.loop_interval);
    },

    pause: () => {
        if (!APP.LIB.game.loop_id) return
        clearInterval(APP.LIB.game.loop_id)
        APP.LIB.game.loop_id = null;
        APP.LIB.storage.save();
    },

    export: () => {
        alert(`Here's your progress data.\n\nThere is no user interface for the import process yet, but if you need to, try opening the dev console (F12) and copy&paste in the following code (and hit enter), and then reload the page:\n\nAPP.DATA.storage[APP.LIB.storage.key] = \`YOUR_SAVE_DATA_CODE\`\n\n--- replace YOUR_SAVE_DATA_CODE with the data below. If nothing works afterwards, type in: APP.LIB.game.reset() ---\n\n${APP.DATA.storage[APP.LIB.storage.key]}`)
    },

    reset: () => {
        if (confirm(`Reset save data? Sure? Really? Are you really sure? For real?\n\nVery well.\n\nClick [OK] to erase your progress.`)) {
            APP.LIB.storage.clear();
            location.reload();
        }
    },
}
