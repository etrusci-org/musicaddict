'use strict'


APP.LIB.random = {
    integer: (min, max) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1) + min)
    },

    array_item: (arr) => {
        return arr[Math.floor(Math.random() * arr.length)]
    },

    name: () => {
        let firstname = APP.LIB.random.array_item(APP.DATA.random.entity_firstname)
        let lastname = APP.LIB.random.array_item(APP.DATA.random.entity_lastname)
        let suffix = APP.LIB.random.array_item(APP.DATA.random.entity_suffix)
        let tier = Math.random()
        if (tier < 0.10) return `${firstname} ${lastname} ${suffix}`
        if (tier < 0.30) return `${firstname} ${lastname}`
        return `${firstname}`
    },

    title: (with_artist=false) => {
        let prefix = APP.LIB.random.array_item(APP.DATA.random.verb_prefix)
        let name = APP.LIB.random.array_item(APP.DATA.random.item_name)
        let suffix = APP.LIB.random.array_item(APP.DATA.random.item_suffix)
        let volume = (Math.random() < 0.10) ? `, ${APP.LIB.random.title_volume()}` : ``
        let artist = (with_artist) ? `${APP.LIB.random.name()} - ` : ``
        let tier = Math.random()
        if (tier < 0.10) return `${artist}${prefix} ${name} ${suffix}${volume}`
        if (tier < 0.40) return `${artist}${prefix} ${name}${volume}`
        return `${artist}${name}${volume}`
    },

    title_volume: (max=50) => {
        return `Vol. ${APP.LIB.random.integer(1, max)}`
    },

    format: () => {
        return APP.LIB.random.array_item(APP.DATA.random.format)
    },

    price: () => {
        let tier = Math.random()
        if (tier < 0.001) return APP.LIB.random.integer(501, 1000)
        if (tier < 0.01) return APP.LIB.random.integer(201, 500)
        if (tier < 0.15) return APP.LIB.random.integer(51, 200)
        if (tier < 0.40) return APP.LIB.random.integer(21, 50)
        if (tier < 0.90) return APP.LIB.random.integer(4, 20)
        if (tier < 1.00) return APP.LIB.random.integer(1, 3)
    },

    record: () => {
        return {
            artist: APP.LIB.random.name(),
            title: APP.LIB.random.title(),
            format: APP.LIB.random.format(),
            price: APP.LIB.random.price(),
        }
    },
}
