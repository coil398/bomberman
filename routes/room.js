var azure = require('azure-storage');

var tableSvc = azure.createTableService(
    'sebomb',
    'UQ6l/g2eSND/QWZrvt3snq3uSKNDjD3jVIC6dw+416FFT4925uT698UVJZ0lzgdpkzEcb03zzqmFPcRZmKPtGA==',
    'https://sebomb.table.core.windows.net/'
);

var debug = false;


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
        if(data){
            this.room_number    = data.room_number;
            this.room_name      = data.room_name;
            this.room_type      = data.room_type;
            this.room_member    = data.room_member ? data.room_member : 1;
            this.room_maxMember = data.room_maxMember;
        }
    }
    return room;
})();

var chkmember = function(room_num,room_mem){
    console.log('debug: ' + debug + ' | room_mem: ' + room_mem);
    if(room_mem == 0 && !debug){
        tableSvc.deleteEntity('roomtable',{
            PartitionKey: entGen.String(ROOMPARTITIONKEY),
            RowKey      : entGen.String(room_num)
        },function(error,res){
            if(!error){
                console.log('Empty rooms deleted.');
            }
            if(error){
                throw error;
            }
        })
        return true;
    }
    return false;
};

var insertData = function(data,room){
    data.room_number    = room.RowKey._;
    data.room_name      = room.RoomName._;
    data.room_type      = room.RoomType._;
    data.room_member    = room.RoomMember._;
    data.room_maxMember = room.RoomMaxMember._;
    return chkmember(data.room_number,data.room_member);
}

var objectizeRooms = function(rooms){
    var tempData;
    var data = new Array();
    for(var i = 0 ; rooms.length ; i++){
        if(i == rooms.length)break;
        tempData = new room();
        if(insertData(tempData,rooms[i]))continue;
        data[tempData.room_number] = tempData;
    }
    return data;
};

exports.get_list = function(req,res){
    debug = false;
    tableSvc.queryEntities('roomtable',null,null,function(error,result){
        if(!error){
            console.log('The data displayed.');
            res.send(JSON.stringify(objectizeRooms(result.entries)));
        }else{
            res.send('An error has occurred in get_list()');
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

var createQuery = function(room_number){
  var query;
  if(room_number){
      query = new azure.TableQuery()
      .where('RowKey eq ?',room_number);
  }else{
      query = null;
  }
  return query;
};

var sendRoomData = function(room_number,res,sender){
    var query = createQuery(room_number);

    tableSvc.queryEntities('roomtable',query,null,function(error,result){
        if(!error){
            console.log(room_number);
            res.send(JSON.stringify(objectizeRooms(result.entries)[room_number]));
        }
        if(error){
            console.log('query error');
        }
    })
};

exports.create = function(req,res){
    console.log(req.body);
    var newRoom = new room(req.body);

    entity = createEntity(newRoom);

    tableSvc.insertEntity('roomtable',entity,function(error,result){
        if(error){
            // 実際の運用では、部屋を作ろうとした時にすでに
            tableSvc.updateEntity('roomtable',entity,function(error,result){
                console.log('The data updated.');
            })
        }
        if(!error){
            console.log('The data inserted.');
        }
        sendRoomData(newRoom.room_number,res);
    });
};

exports.debug = function(req,res){
    debug = true;

    req.body = {
        room_number   : '0',
        room_name     : 'testRoom',
        room_type     : 'debug',
        room_member   : '0',
        room_maxMember: '0'
      };

    exports.create(req,res);

};

exports.deletetable = function(req,res){
    tableSvc.deleteTable('roomtable', function(error, response){
    if(!error){
        console.log('all deleted');
    }
    res.send('completed');
  });
};
