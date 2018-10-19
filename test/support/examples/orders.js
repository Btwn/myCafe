'use strict'

const beverage = require('./beverages')

var counter = 0

function asOrderItem(itemExample){
    return {
        beverage: beverage[itemExample.beverage](),
        quantity: itemExample.quantity
    }
}

module.exports = {
    empty: function(){
        return {
            id: '<empty order>',
            data: []
        }
    },
    withItems: function(itemExamples){
        counter += 1
        return {
            id: '<non empty order ' + counter + '>',
            data: itemExamples.map(asOrderItem)
        }
    }
}
