var DB = require('./accessToDB');

/*
DB.GetRoomList(function(result){
    console.log(result);
});
*/

/*
DB.EnterRoom(1,function(result){
    console.log(result);
});
*/

DB.LeaveRoom(1,function(result){
    console.log(result);
});
