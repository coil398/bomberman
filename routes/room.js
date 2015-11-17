var azure = require('azure-storage');
var uuid = require('node-uuid');

var tableSvc = azure.createTableService(
    'sebomb',
    'UQ6l/g2eSND/QWZrvt3snq3uSKNDjD3jVIC6dw+416FFT4925uT698UVJZ0lzgdpkzEcb03zzqmFPcRZmKPtGA==',
    'https://sebomb.table.core.windows.net/'
);


tableSvc.createTableIfNotExists('roomtable',function(err,created){
    console.log('The roomtable got prepared.');
});

var entGen = azure.TableUtilities.entityGenerator;


exports.create_room = function(req,res){
    console.log(req.body.id + ' : ' + req.body.description);
    id = req.body.id;
    description = req.body.description;
    var task = {
        PartitionKey: entGen.String('room'),
        RowKey: entGen.String(id),
        description: entGen.String(description)
    };

    tableSvc.insertEntity('roomtable',task,function(error,result,res){
        if(error){
            tableSvc.updateEntity('roomtable',task,function(error,result,res){
                console.log('The data updated.');
            })
        }
        if(!error){
            console.log('The data inserted.');
        }
    });

    res.send('Completed.');
};

exports.get_list = function(req,res){
    tableSvc.queryEntities('roomtable',null,null,function(error,result){
        if(!error){
            console.log('The data displayed.');
            data = result.entries;
            console.log(data);
        }
        res.send(data);
    });
};

exports.get_detail = function(req,res){
    var id = req.params.id.toString();
    tableSvc.retrieveEntity('roomtable','recent',id,function(error,result,response){
        if(!error){
            console.log('The data retrieved.');
        }
        res.send(result);
    });
}

exports.deletetable = function(req,res){
    tableSvc.deleteTable('roomtable', function(error, response){
    if(!error){
        console.log('all deleted');
    }
    res.send('completed');
  });
}
