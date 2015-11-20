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

var chkMember = function(room_number,room_member,room_maxMember){
    console.log('debug: ' + debug + ' | room_mem: ' + room_member);
    if(room_member == 0 && !debug){
        tableSvc.deleteEntity('roomtable',{
            PartitionKey: entGen.String(ROOMPARTITIONKEY),
            RowKey      : entGen.String(room_number)
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

    if(room_member >= room_maxMember){
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
    return chkMember(data.room_number,data.room_member);
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

var getRoomData = function(room_number,res,sender){
    var query = createQuery(room_number);

    tableSvc.queryEntities('roomtable',query,null,function(error,result){
        if(!error){
            console.log('room_number: ' + room_number);
            sender(res,objectizeRooms(result.entries)[room_number]);
        }
        if(error){
            console.log('query error');
        }
    })
};

exports.create = function(req,res){
    debug = false;
    console.log(req.body);
    var newRoom = new room(req.body);

    entity = createEntity(newRoom);

    tableSvc.insertEntity('roomtable',entity,function(error,result){
        if(error){
            // 実際の運用では、部屋を作ろうとした時にすでに部屋があればエラー返すとか
            tableSvc.updateEntity('roomtable',entity,function(error,result){
                console.log('The data updated.');
            });
        }
        if(!error){
            console.log('The data inserted.');
        }
        console.log('問題なし');
        getRoomData(newRoom.room_number,res,function(res,result){
            res.send(JSON.stringify(result));
        });
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

var chkMemberAndAdd = function(data,addition){
    if(chkMember(data.room_number,data.room_member,data.room_maxMember)){
        return true;
    }
    data.room_member++;
    return false;
};

exports.enter = function(req,res){
    console.log('Entring the room number ' + req.body.room_number);
    getRoomData(req.body.room_number,res,function(res,result){
        console.log('result: ' + result);
        var isFull;
        isFull = chkMemberAndAdd(result,1);

        entity = createEntity(result);

        tableSvc.updateEntity('roomtable',entity,function(error){
            if(isFull){
                result = 'The room is already full.';
            }
            console.log('A person entered.');
            res.send(JSON.stringify(result));
        });
    });

};

var deleteEmptyRooms = function(data){
    var task = {
        PartitionKey: entGen.String(ROOMPARTITIONKEY),
        RowKey: entGen.Int32(data.room_number)
    };

    tableSvc.deleteEntity('roomtable',task,function(error,res){
        if(!error){
            console.log('An empty room deleted');
        }
    });
}

exports.leave = function(req,res){
  console.log('leaving the room number ' + req.body.room_number);
  getRoomData(req.body.room_number,res,function(res,result){
      console.log('result: ' + result);
      var isEmpty = false;
      result.room_member--;

      if(result.room_member == 0){
          deleteEmptyRooms(result);
          isEmpty = true;
      }

      entity = createEntity(result);

      tableSvc.updateEntity('roomtable',entity,function(error){
          console.log('A person left.');
          if(isEmpty)result = 'An empty room deleted';
          res.send(JSON.stringify(result));
      });
  });
};
