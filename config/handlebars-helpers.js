const moment = require('moment')

module.exports = {
    ifEquals: (a, b, options) => {
        if (a == b) {
            return options.fn(this)
        }
        else {
            return options.inverse(this)
        }
    },

    moment: (a) => {
        return moment(a).fromNow()
    }
}