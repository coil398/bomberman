var azure = require('azure-storage');
var uuid = require('node-uuid');

var tableSvc = azure.createTableService(
    'sebomb',
    'UQ6l/g2eSND/QWZrvt3snq3uSKNDjD3jVIC6dw+416FFT4925uT698UVJZ0lzgdpkzEcb03zzqmFPcRZmKPtGA==',
    'https://sebomb.table.core.windows.net/'
);


tableSvc.createTableIfNotExists('recenttable',function(err,created){
    console.log('The table has been created.');
});

var entGen = azure.TableUtilities.entityGenerator;


exports.create = function(req,res){
    console.log(req.body.id + ' : ' + req.body.description);
    id = req.body.id;
    description = req.body.description;
    var task = {
        PartitionKey: entGen.String('recent'),
        RowKey: entGen.String(id),
        description: entGen.String(description)
    };

    tableSvc.insertEntity('recenttable',task,function(error,result,res){
        if(error){
            tableSvc.updateEntity('recenttable',task,function(error,result,res){
                console.log('The data updated.');
            })
        }
        if(!error){
            console.log('The data inserted.');
        }
    });

    res.send('Completed.');
};

exports.delete = function(req,res){
    id = req.params.id.toString();
    var task = {
        PartitionKey: entGen.String('recent'),
        RowKey: entGen.String(id)
    }

    tableSvc.deleteEntity('recenttable',task,function(error){
        if(!error){
            console.log('The data deleted.');
        }
        res.send('Succeeded.');
    });
};

exports.getAll = function(req,res){
    tableSvc.queryEntities('recenttable',null,null,function(error,result){
        if(!error){
            console.log('The data displayed.');
            data = result.entries;
            console.log(data);
        }
        res.send(data);
    });
};

exports.get = function(req,res){
    var id = req.params.id.toString();
    tableSvc.retrieveEntity('recenttable','recent',id,function(error,result,response){
        if(!error){
            console.log('The data retrieved.');
        }
        res.send(result);
    });
}

exports.deletetable = function(req,res){
    tableSvc.deleteTable('recenttable', function(error, response){
    if(!error){
        console.log('all deleted');
    }
    res.send('completed');
  });
}

/*
var task = {
    PartitionKey: entGen.String('hometasks'),
    RowKey: entGen.String('1'),
    description: entGen.String('take out the trash'),
};

tableSvc.insertEntity('recenttable',task, function (error, result, response) {
    if(!error){
        console.log('The data inserted.' + response.object);
    }
});
*/

/*
var del = function(req,res){
    var id = req.params.id;
    var task = {
        Partition:{'_':'hometasks'},
        RowKey:{'_':id}
    };

    tableSvc.deleteEntity('recenttable',task,function(error,res){
        if(!error){
            console.log('The data deleted.');
        }
    })
}
*/

/*
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'winedb' database");
        db.collection('wines', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'wines' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

var MongoClient = mongo.MongoClient;

MongoClient.connect(connectionString,function(err,db){
    if(err) throw err;
    if(!err){
        console.log('Connected to "recentdb" database');
        db.collection('recent',{strict:true},
            function(err,collection){
                if(err){
                    console.log(
                        "The 'recentdb' collection doesn¥'t exist. Creating it with sample data...");
                        populateDB(db);
                }
            });
    }
})

var populateDB = function(db){
    var sample = [
      {
          name:'name',
          hoge:'hage'
      },
      {
          name:'kyoko',
          hoge:'yu'
      }
    ];
    db.collection('recent',function(err,collection){
        collection.insert(sample,{safe:true},
        function(err,result){});
    });
};



/*
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('mongodb://sebomb:LI7B3if7cc_GEFQg6NNN5aG39YjBBTTfTAartjBcYC8-@ds042128.mongolab.com:42128/sebomb', 27017, {auto_reconnect: true});
db = new Db('winedb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'winedb' database");
        db.collection('wines', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'wines' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.addWine = function(req, res) {
    var wine = req.body;
    console.log('Adding wine: ' + JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
        collection.insert(wine, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
*/
