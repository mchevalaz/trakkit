var Schema = require("./schema")
var User = Schema.User;
var storage = (function () {
    function storage() { }
    storage.log = require("../utils/log.js");
    storage.mongoose = require("mongoose");
    storage.data = new Schema.Schema();
    storage.init = function init(dbName, ignoreFailures) {
        if(dbName == null) {
            dbName = "trakkit";
        }
        try  {
            storage.mongoose.connect('localhost', dbName);
            storage.log.debug("database connected");
        } catch (e) {
            if(!ignoreFailures) {
                throw e;
            }
        }
    };
    storage.disconnect = function disconnect() {
        storage.mongoose.disconnect();
    };
    storage.saveAll = function saveAll(docs, callback) {
        var count = 0;
        docs.forEach(function (doc) {
            doc.save(function (err) {
                count++;
                if(count == docs.length) {
                    callback();
                }
            });
        });
    };
    storage.findUser = function findUser(name, callback) {
        storage.data.UserData.findOne({
            name: name
        }, callback);
    };
    return storage;
})();
exports.storage = storage;
//@ sourceMappingURL=db.js.map
