using UnityEngine;
using System.Collections;

public class RoomScript : MonoBehaviour
{

    void Start()
    {
        // Photonへの接続を行う
        PhotonNetwork.ConnectUsingSettings("v0.1");
    }

    void OnConnectedToMaster()
    {
        PhotonNetwork.JoinRandomRoom();
    }

    void OnPhotonRandomJoinFailed()
    {
        Debug.Log("Can't join random room");
        PhotonNetwork.CreateRoom(null);
    }

    void OnJoinedRoom()
    {
        Debug.Log("True");
    }

    void OnGUI()
    {
        GUILayout.Label(PhotonNetwork.connectionStateDetailed.ToString());
    }
}
