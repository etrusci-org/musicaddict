'use strict';


APP.LIB.storage = {
    key: APP.name,

    save: () => {
        APP.DATA.storage.setItem(APP.LIB.storage.key, JSON.stringify({
            version_app: APP.version,
            version_storage: APP.version_storage,
            ram:  APP.DATA.ram,
            char: APP.DATA.char,
        }))
        APP.DATA.ram.last_save = Date.now()
    },

    load: () => {
        let save_data = APP.DATA.storage.getItem(APP.LIB.storage.key)
        save_data = JSON.parse(save_data)
        if (!save_data) return

        if (save_data.version_storage != APP.version_storage) {
            console.info('old save_data version, auto-reset ...')
            alert('old save_data version, auto-reset ... sorry :/')
            APP.DATA.storage.clear();
        }
        else {
            APP.DATA.ram  = save_data.ram
            APP.DATA.char = save_data.char
        }
    },

    clear: () => {
        APP.DATA.storage.clear()
    }
}
