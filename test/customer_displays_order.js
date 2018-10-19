'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const newStorage = require('./support/storageDouble')
const order = require('./support/examples/orders')
const errors = require('./support/examples/errors')
const orderSystemWith = require('../lib/orders')
const Q = require('q')

chai.use(require('sinon-chai'))
chai.use(require('chai-as-promised'))

describe('El cliente visualiza la orden', function(){
    beforeEach(function(){
        this.orderStorage = newStorage()
        this.messageStorage = newStorage()
        this.orderSystem = orderSystemWith({
            order: this.orderStorage.dao(),
            message: this.messageStorage.dao()
        })
    })
    context('Dado que la orden esta vacia', function(){
        beforeEach(function(){
            this.order = this.orderStorage.alreadyContains(order.empty())
            this.messages = this.messageStorage.alreadyContains({
                id: this.order.id,
                data: []
            })
            this.messageStorage.updateWillNotFail()
            this.result = this.orderSystem.display(this.order.id)
        })
        it('no deberia mostrar articulos en la orden', function(){
            return expect(this.result).to.eventually.have.property('items')
                    .that.is.empty
        })
        it('deberia mostrar 0 en el precio total', function(){
            return expect(this.result).to.eventually.have.property('totalPrice')
                    .that.is.equal(0)
        })
        it('solo deberia ser posible añadir bebidas', function(){
            return expect(this.result).to.eventually.have.property('actions')
                    .that.is.deep.equal([{
                        action: 'append-beverage',
                        target: this.order.id,
                        parameters: {
                            beverageRef: null,
                            quantity: 0
                        }
                    }])
        })
    })

    function scenarioOrderContainsBeverages(testExample){
        context('Dado que la orden contiene bebidas ' + testExample.title, function(){
            beforeEach(function(){
                this.order = this.orderStorage
                    .alreadyContains(testExample.items)
                this.messages = this.messageStorage.alreadyContains({
                    id: this.order.id,
                    data: []
                })
                this.messageStorage.updateWillNotFail()
                this.orderActions = order.actionFor(this.order)
                this.result = this.orderSystem.display(this.order.id)
            })
            it('deberia de mostrar un articulo por bebida', function(){
                return expect(this.result).to.eventually
                    .have.property('items')
                    .that.is.deep.equal(this.order.data)
            })
            it('deberia de mostrar la suma de los precios de cada unidad como precio total', function(){
                return expect(this.result).to.eventually
                    .have.property('totalPrice').that.is.equal(testExample.expectedTotalPrice)
            })
            it('deberia ser posible pagar la orden', function(){
                return expect(this.result).to.eventually
                    .have.property('actions')
                    .that.include(this.orderActions.place())
            })
            it('deberia ser posible añadir una bebida', function(){
                return expect(this.result).to.eventually
                    .have.property('actions')
                    .that.include(this.orderActions.appendItem())
            })
            
            testExample.item.forEach(function(itemExample,i){
                it('deberia ser posible remover una bebida ' + itemExample.beverage, function(){
                    return expect(this.result).to.eventually
                        .have.property('actions')
                        .that.include(this.orderActions.removeItem(i))
                })
                it('deberia ser posible cambiar la cantidad de una babida ' + itemExample.beverage, function(){
                    return expect(this.result).to.eventually
                        .have.property('actions')
                        .that.include(this.orderActions.editItemQuantity(i))
                })
            })
        })
    }

    [
        {
            title: '1 Expresso and 2 Mocaccino',
            item: [
                { beverage: 'expresso', quantity: 1 },
                { beverage: 'mocaccino', quantity: 2 }
            ],
            expectedTotalPrice: 6.10
        },
        {
            title: '1 Expresso, 2 Mocaccino y 1 capuccino',
            item: [
                { beverage: 'expresso', quantity: 1 },
                { beverage: 'mocaccino', quantity: 2 },
                { beverage: 'capuccino', quantity: 1 }
            ],
            expectedTotalPrice: 7.30
        }
    ].forEach(scenarioOrderContainsBeverages)

    function scenarioOrderHasPendingMessages(testExample){
        context('Dado que la orden tiene mensajes pendientes ' + testExample.title, function(){
            beforeEach(function(){
                this.order = this.orderStorage.alreadyContains(order.empty())
                this.messages = this.messageStorage.alreadyContains({
                    id: this.order.id,
                    data: testExample.pendingMessages
                })
                this.messageStorage.updateWillNotFail()
                this.result = this.orderSystem.display(this.order.id)
                return this.result
            })
            it('deberia mostrar los mensajes pendientes', function(){
                return expect(this.result).to.eventually
                    .have.property('messages')
                    .that.is.deep.equal(this.messages.data)
            })
            it('no habra mas mensajes pendientes',function(){
                this.messageStorage.toExpectUpdate({
                    id: this.order.id,
                    data: []
                })
            })
        })
    }

    [
        {
            title: 'bad quantity[-1]',
            pendingMessages: [errors.badQuantity(-1)]
        },
        {
            title: 'beverage does not exist, bad quantity[0]',
            pendingMessages: [
                errors.beverageDoesNotExist(),
                errors.badQuantity(-1)
            ]
        }
    ].forEach(scenarioOrderHasPendingMessages)
})
