var azure = require('azure-storage');
var uuid = require('node-uuid');

var tableSvc = azure.createTableService(
    'sebomb',
    'UQ6l/g2eSND/QWZrvt3snq3uSKNDjD3jVIC6dw+416FFT4925uT698UVJZ0lzgdpkzEcb03zzqmFPcRZmKPtGA==',
    'https://sebomb.table.core.windows.net/'
);


tableSvc.createTableIfNotExists('tokentable',function(err,created){
    console.log('The tokentable got prepared.');
});

var entGen = azure.TableUtilities.entityGenerator;

var createEntity = function(req){
  var id = uuid.v1();

  var app_code_name = req.body.navigator.app_code_name,
      app_name      = req.body.navigator.app_name,
      app_version   = req.body.navigator.app_version,
      platform      = req.body.navigator.platform,
      userAgent     = req.body.navigator.userAgent;

  var task = {
      PartitionKey: entGen.String('token'),
      RowKey: entGen.String(id),
      app_code_name: entGen.String(app_code_name),
      app_name: entGen.String(app_name),
      app_version: entGen.String(app_version),
      platform: entGen.String(platform),
      userAgent: entGen.String(userAgent)
  };

  return task;
}

var sender = function(res){
    var response = {
        'usertoken' : 'usertoken',
        'username' : 'username'
    };

    res.send(JSON.stringify(response));
}

exports.create_token = function(req,res){
    var task = createEntity(req);

    console.log(task);

    tableSvc.insertEntity('tokentable',task,function(error,result,res){
        if(error){
            tableSvc.updateEntity('tokentable',task,function(error,result,res){
                console.log('The data updated.');
            })
        }
        if(!error){
            console.log('The data inserted.');
        }
    });

    sender(res);
};

exports.get_list = function(req,res){
    tableSvc.queryEntities('tokentable',null,null,function(error,result){
        if(!error){
            console.log('The data displayed.');
            data = result.entries;
            console.log(data);
            res.send(data);
        }

    });
};

exports.deletetable = function(req,res){
    tableSvc.deleteTable('tokentable', function(error, response){
    if(!error){
        console.log('all deleted');
    }
    res.send('completed');
  });
};
