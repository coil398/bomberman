var connectionToNode;

function Start () {
    Application.targetFrameRate = 0.1;
    connectionToNode = GetComponent("ConnectionToNode");
}

function CallForRoomList(){
    connectionToNode.writeSocket("CallForRoomList");
}

function Update () {
    Debug.Log(connectionToNode);
    if(connectionToNode){
        CallForRoomList();
    }
}

function OnGUI(){
    if(GUI.Button(Rect(200,40,200,60),"Send")){
        connectionToNode.writeSocket("test");
    }

    if(GUI.Button(Rect(200,120,200,60),"Send")){
    }

    if(GUI.Button(Rect(200,200,200,60),"Send")){
    }

    if(GUI.Button(Rect(200,280,200,60),"Send")){
    }
}
