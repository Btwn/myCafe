'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const newStorage = require('./support/storageDouble')
const order = require('./support/examples/orders')
const orderSystemWith = require('../lib/orders')
const Q = require('q')

chai.use(require('chai-as-promised'))

describe('El cliente visualiza la orden', function(){
    beforeEach(function(){
        this.orderStorage = newStorage()
        this.orderSystem = orderSystemWith(this.orderStorage.dao())
    })
    context('Dado que la orden esta vacia', function(){
        beforeEach(function(){
            this.order = this.orderStorage.alreadyContains(order.empty())
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

    context('Dado que la orden contiene bebidas', function(){
        beforeEach(function(){
            this.order = this.orderStorage
                .alreadyContains(order.withItems([
                    { beverage: 'expresso', quantity: 1 },
                    { beverage: 'mocaccino', quantity: 2 }
                ]))
            this.result = this.orderSystem.display(this.order.id)
        })
        it('deberia de mostrar un articulo por bebida', function(){
            return expect(this.result).to.eventually
                .have.property('items')
                .that.is.deep.equal(this.order.data)
        })
        it('deberia de mostrar la suma de los precios de cada unidad como precio total', function(){
            return expect(this.result).to.eventually
                .have.property('totalPrice').that.is.equal(6.10)
        })
        it('deberia ser posible pagar la orden')
        it('deberia ser posible añadir una bebida')
        it('deberia ser posible remover una bebida')
        it('deberia ser posible cambiar la cantidad de una babida')
    })

    context('Dado que la orden tiene mensajes pendientes', function(){
        it('deberia mostrar los mensajes pendientes')
        it('no habra mas mensajes pendientes')
    })
})
