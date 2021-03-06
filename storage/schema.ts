///<reference path='../def/all.ts'/>
///<reference path='../node_modules/typescript-require/typings/node.d.ts'/>

var mongoose:any = require("mongoose");

// Need to provide the same structure in 'mongoose' style format to define.
var userSchema = new mongoose.Schema(
    {
        name: String,
        twitterId:String,
        facebookId:String,
        googleId:String,
        photoUrl:String,
        email:String
    });

var dataPointSchema = new mongoose.Schema({
    xAxis: String,
    yAxis: String
});

var trackSchema = new mongoose.Schema({
    dataPoints: [dataPointSchema],
    name: String,
    user: {type: mongoose.Schema.ObjectId, ref:"User"}
})

export var User:IMongooseSearchable = mongoose.model('User', userSchema);
export var DataPoint:IMongooseSearchable = mongoose.model('DataPoint', dataPointSchema);
export var Track:IMongooseSearchable = mongoose.model('Track', trackSchema);

export class db{
    init(dbName:string, ignoreFailures:bool){
        if(dbName == null){
            dbName = "trakkit";
        }

        try{
            mongoose.connect('localhost', dbName);
            //mongoose.set('debug', true)
        }
        catch(e){
            if(!ignoreFailures){
                throw e;
            }
        }
    }

    disconnect(){
        mongoose.disconnect();
    }

    newUser():IUser{
        var u:any = <any>User;
        return new (<{ new() : IUser;}>u)();
    }

    newDataPoint():IDataPoint{
        var d:any = <any>DataPoint;
        return new(<{ new() : IDataPoint; }>d)();
    }

    newTrack():ITrack{
        var t:any = <any>Track;
        return new(<{ new() : ITrack; }>t)();
    }

    newObjectId(id:String):any{
        return mongoose.Types.ObjectId(id);
    }

    pruneObject(data:IMongooseBase):Object{
        var obj:any = data.toObject();
        if(obj.hasOwnProperty("_id")){
            delete obj._id;
        }

        if(obj.hasOwnProperty("_v")){
            delete obj._v;
        }

        return obj;
    }

    extractMongoFields(item:any, name:String){
        var ret = {};
        for(var key in item){
            if(key != "_v" && key != "_id"){
                ret[name + ".$." + key] = item[key];
            }
        }
        return ret;
    }

    extractIds(items:IMongooseBase[]){
        return items.map(item => item._id);
    }

    saveAll(docs:IMongooseBase[], callback:() => any){
        var count = 0;
        docs.forEach(doc => {
            doc.save(() => {
                count++;
                if( count == docs.length ){
                    callback();
                }
            });
        });
    }
}

