var p;

function awake(){

}

function Start () {
    p = GetComponent("ConnectionToNode");
}

function Update () {
}

function OnGUI(){
    if(GUI.Button(Rect(200,40,200,60),"Send")){
        p.writeSocket("ROOMDATA");
    }

    if(GUI.Button(Rect(200,120,200,60),"Send")){
        print(p.readSocket());
    }

    if(GUI.Button(Rect(200,200,200,60),"Send")){
    }

    if(GUI.Button(Rect(200,280,200,60),"Send")){
    }
}
