'use strict'


(() => {
    console.debug(`${APP.name} v${APP.version} (storage v${APP.version_storage})`)
    APP.LIB.storage.load()
    APP.UI.init()
})()
