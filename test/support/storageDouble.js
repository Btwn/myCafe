'use strict'

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')

module.exports = function(){
    var dao = {
        byId: sinon.stub(),
        update: sinon.stub()
    }
    var storage = {}

    storage.updateWillNotFail = function(){
        dao.update.callsArgWithAsync(1,null)
    }

    storage.dao = function(){
        return dao
    }

    storage.alreadyContains = function(entity){
        var data = entity.data
        dao.byId
            .withArgs(entity.id)
            .callsArgWithAsync(1,null,data)
        return entity
    }

    storage.toExpectUpdate = function(entity){
        expect(dao.update).to.be.calledWith(entity)
    }

    return storage

}
