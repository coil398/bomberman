var azure = require('azure-storage');
var uuid = require('node-uuid');

var tableSvc = azure.createTableService(
    'sebomb',
    'UQ6l/g2eSND/QWZrvt3snq3uSKNDjD3jVIC6dw+416FFT4925uT698UVJZ0lzgdpkzEcb03zzqmFPcRZmKPtGA==',
    'https://sebomb.table.core.windows.net/'
);


tableSvc.createTableIfNotExists('roomtable',function(err,created){
    console.log('The roomtable is ready.');
});

var entGen = azure.TableUtilities.entityGenerator;

var ROOMPARTITIONKEY = 'room';

var room = (function(){

    var room_number,
        room_name,
        room_type,
        room_member,
        room_maxMember;

    var room = function(data){
        console.log('data: ' + data);
        if(data){
            this.room_number    = data.room_number;
            this.room_name      = data.room_name;
            this.room_type      = data.room_type;
            this.room_member    = 1;
            this.room_maxMember = data.room_maxMember;
        }
    }
    return room;
})();

var objectizeRooms = function(rooms){
    var data = new Array();
    for(var i = 0 ; rooms.length ; i++){
        if(i == rooms.length)break;
        data[i] = new room();
        data[i].room_number    = rooms[i].RowKey._;
        data[i].room_name      = rooms[i].RoomName._;
        data[i].room_type      = rooms[i].RoomType._;
        data[i].room_mem       = rooms[i].RoomMember._;
        data[i].room_maxMember = rooms[i].RoomMaxMember._;
    }
    return data;
};

exports.get_list = function(req,res){
    tableSvc.queryEntities('roomtable',null,null,function(error,result){
        if(!error){
            console.log('The data displayed.');
            res.send(JSON.stringify(objectizeRooms(result.entries)));
        }
    });
};

var createEntity = function(room){

    var entity = {
        PartitionKey  : entGen.String(ROOMPARTITIONKEY),
        RowKey        : entGen.Int32(room.room_number),
        RoomName      : entGen.String(room.room_name),
        RoomType      : entGen.String(room.room_type),
        RoomMember    : entGen.Int32(room.room_member),
        RoomMaxMember : entGen.Int32(room.room_maxMember)
    };

    return entity;
};

var sender = function(res,result){
    res.send(result);
};

var roomData = function(room_number,res,sender){
    var query;
    if(room_number){
        query = new azure.TableQuery()
        .where('RowKey eq ?',room_number);
    }else{
        query = null;
    }

    tableSvc.queryEntities('roomtable',query,null,function(error,result){
        if(!error){
            sender(JSON.stringify(objectizeRooms(result.entries)));
        }
        if(error){
            console.log('query error');
        }
    })
}

exports.create = function(req,res){
    console.log(req.body);
    var newRoom = new room(req.body);

    entity = createEntity(newRoom);

    tableSvc.insertEntity('roomtable',entity,function(error,result){
        if(error){
            // 呼び出されるとまずい
            tableSvc.updateEntity('roomtable',entity,function(error,result){
                console.log('The data updated.');
            })
        }
        if(!error){
            console.log('The data inserted.');
        }
        roomData(newRoom.room_number,res,function(result){
            res.send(result);
        });
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
