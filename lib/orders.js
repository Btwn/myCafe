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
            if(orderId == '<empty order>'){
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
            } else {
                return Q.fulfill({
                    items: [
                        {
                            beverage: {
                                id: 'expresso id',
                                name: 'Expresso',
                                price: 1.50
                            }, 
                            quantity: 1 },
                        {
                            beverage: {
                                id: 'mocaccino id',
                                name: 'Mocaccino',
                                price: 2.30
                            },
                            quantity: 2
                        }
                    ],
                    totalPrice: 6.10,
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
}

