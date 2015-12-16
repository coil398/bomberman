var p;

function Start () {
    p = GetComponent("ConnectionToNode");
}

function Update () {

}

function OnGUI(){
    if(GUI.Button(Rect(200,40,80,20),"Send")){
        p.writeSocket("fromjs");
    }
    if(GUI.Button(Rect(300,40,80,20),"Recv")){
        var s = p.readSocket();
        if( s != "" ){
            print("recv string:" + s);
        }
    }
}
