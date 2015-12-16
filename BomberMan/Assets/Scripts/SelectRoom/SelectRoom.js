

function Start () {
    Application.targetFrameRate = 0.1;
    var connectionToNode = GetComponent("ConnectionToNode");
}

function Update () {
    
}

function OnGUI(){
    if(GUI.Button(Rect(200,40,200,60),"Send")){
    }

    if(GUI.Button(Rect(200,120,200,60),"Send")){
    }

    if(GUI.Button(Rect(200,200,200,60),"Send")){
    }

    if(GUI.Button(Rect(200,280,200,60),"Send")){
    }
}
