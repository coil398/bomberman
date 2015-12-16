var Sequelize = require('sequelize');
var util = require('util');
var sequelize = new Sequelize('sebomb','node','',{
    host:'localhost',
    dialect:'mysql',
    pool:{
        max:5,
        min:0,
        idle:10000
    }
});

var Room = sequelize.define('Room',{
    RoomNumber: Sequelize.INTEGER,
    NumberOfPeople: Sequelize.INTEGER
});

var room = Room.build();

exports.GetRoomList = function(result){
    var roomData = new Array();
    Room.findAll({
        attributes:['RoomNumber','NumberOfPeople']
    }).then(function(room){
        for(var i = 0 ; i < 4 ; i ++){
            roomData[i] = room[i]['dataValues'];
        }
        result(JSON.stringify(roomData));
    });

    /*
    roomData = Room.findAll();
    console.log('Data: ' + roomData['roomNumber']);
    */
}

/*
exports.CreateRoom = function(roomNumber){
    Room.create({
        RoomNumber: roomNumber,
        NumberOfPeople: 0
    });
};
*/

exports.EnterRoom = function(roomNumber,result){
    Room.find({
        where:{
            RoomNumber:roomNumber
        },
        attributes:['id','RoomNumber','NumberOfPeople']
    }).then(function(room){
        if(current == 4){
            console.log('full');
        }else{
            room.updateAttributes({
                NumberOfPeople:room['dataValues']['NumberOfPeople']+1
            }).then(function(room){
                result('A person entered');
            });
        }
    });
};

exports.LeaveRoom = function(roomNumber,result){
    Room.find({
        where:{
            RoomNumber:roomNumber
        },
        attributes:['id','RoomNumber','NumberOfPeople']
    }).then(function(room){
        room.updateAttributes({
            NumberOfPeople:room['dataValues']['NumberOfPeople']-1
        }).then(function(room){
            result('A person left');
        });
    });
}
