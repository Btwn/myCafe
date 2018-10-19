'use strict'

const sinon = require('sinon')

module.exports = function(){
    var dao = { byId: sinon.stub() }
    var storage = {}

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

    return storage

}
