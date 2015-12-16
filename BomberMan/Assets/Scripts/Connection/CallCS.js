

function Start () {

}

function Update () {

}

function OnGUI(){
    if(GUI.Button(Rect(200,40,80,20),"Send")){
        var psend = GetComponent("ConnectionToNode");
        Debug.Log(psend);
        psend.writeSocket("fromjs");
    }
    if(GUI.Button(Rect(300,40,80,20),"Recv")){
        var precv = GetComponent("ConnectionToNode");
        var s = precv.readSocket();
        if( s != "" ){
            print("recv string:" + s);
        }
    }
}
