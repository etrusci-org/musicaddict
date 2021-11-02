'use strict'


APP.UI = {
    e: {},

    init: () => {
        document.querySelectorAll('.ui').forEach((ele) => {
            ele.classList.add(ele.dataset.key)
            if (ele.dataset.key) APP.UI.e[ele.dataset.key] = ele
        })

        if (APP.DATA.storage.length > 0) {
            APP.UI.set_e('ctrl_play', `continue`)
            APP.UI.e.ctrl_export.classList.remove('hide')
            APP.UI.e.ctrl_reset.classList.remove('hide')
            APP.UI.e.story.classList.add('hide')
        }

        APP.UI.e.ctrl_play.onclick = () => {
            APP.LIB.game.play()
            APP.UI.e.ctrl_play.classList.add('hide')
            APP.UI.e.ctrl_about.classList.add('hide')
            APP.UI.e.ctrl_export.classList.add('hide')
            APP.UI.e.ctrl_reset.classList.add('hide')
            APP.UI.e.main.classList.remove('hide')
            APP.UI.e.ctrl_pause.classList.remove('hide')
        }

        APP.UI.e.ctrl_pause.onclick = () => {
            APP.LIB.game.pause()
            APP.UI.set_e('ctrl_play', `continue`)
            APP.UI.e.main.classList.add('hide')
            APP.UI.e.ctrl_pause.classList.add('hide')
            APP.UI.e.story.classList.add('hide')
            APP.UI.e.ctrl_about.classList.remove('hide')
            APP.UI.e.ctrl_play.classList.remove('hide')
            APP.UI.e.ctrl_export.classList.remove('hide')
            APP.UI.e.ctrl_reset.classList.remove('hide')
        }

        APP.UI.e.ctrl_export.onclick = () => {
            APP.LIB.game.export()
        }

        APP.UI.e.ctrl_reset.onclick = () => {
            APP.LIB.game.reset()
        }

        APP.UI.e.ctrl_about.onclick = () => {
            alert(`${APP.name}\n${APP.description}\n\nGame version: ${APP.version}\nStorage version: ${APP.version_storage}\nAuthor: ${APP.author}`)
        }
    },

    set_e: (key, val, with_class) => {
        if (with_class) val = `<span class="${with_class}">${val}</span>`

        if (!APP.UI.e[key]) {
            console.error(`APP.UI.set_e() -> unknown UI key: ${key}`)
            return
        }

        switch (key) {
            case 'log':
                let li = document.createElement('li')
                li.innerHTML = `&rarr; ${val}`
                APP.UI.e[key].prepend(li)
            break

            case 'log_img':
                APP.UI.e.log_img.style.backgroundImage = `url('res/${val}.gif')`
            break

            default:
                APP.UI.e[key].innerHTML = val
        }
    },

    on_tick: () => {
        while (APP.UI.e.log.children.length >= APP.DATA.game.log_length_max) {
            APP.UI.e.log.removeChild(APP.UI.e.log.lastElementChild)
        }

        APP.UI.set_e('game_started', sec_to_dhms((Date.now() - APP.DATA.ram.game_start_time) / 1000))
        APP.UI.set_e('last_save', sec_to_dhms((Date.now() - APP.DATA.ram.last_save) / 1000))

        APP.UI.set_e('char_records', APP.DATA.char.records.length)
        APP.UI.set_e('char_cash', `${APP.DATA.char.cash}${APP.DATA.game.curs}`)
        // APP.UI.set_e('char_records_discovered', APP.DATA.char.records_discovered)
        // APP.UI.set_e('char_offers_received', APP.DATA.char.offers_received)
        APP.UI.set_e('char_records_bought', APP.DATA.char.records_bought)
        APP.UI.set_e('char_records_sold', APP.DATA.char.records_sold)
        APP.UI.set_e('char_total_spent', `${APP.DATA.char.total_spent}${APP.DATA.game.curs}`)
        APP.UI.set_e('char_total_earned', `${APP.DATA.char.total_earned}${APP.DATA.game.curs}`)
        APP.UI.set_e('char_trade_profit', `${APP.DATA.char.trade_profit}${APP.DATA.game.curs}`)
    },
}
