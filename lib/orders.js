/*
function order(order){
    //console.log(order)
    function display(order){
        return {
            items: [],
            totalPrice: 0,
            actions: [{
                action: 'append-beverage',
                target: 'algun id de orden vacio',
                parameters: {
                    beverageRef: null,
                    quantity: 0
                }
            }]
        }
    }
    return {
        display: display
    }
}

module.exports = order

*/


var Q = require('q')

module.exports = function () {
    return {
        display: function (orderId) {
            return Q.fulfill({
                items: [],
                totalPrice: 0,
                actions: [
                    {
                        action: 'append-beverage',
                        target: orderId,
                        parameters: {
                            beverageRef: null,
                            quantity: 0
                        }
                    }
                ]
            })
        }
    }
}

