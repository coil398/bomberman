using UnityEngine;
using System.Collections;

public class RoomsScript : MonoBehaviour
{
    private int[] states = new int[4];

    private void Start()
    {
        // Photonへの接続を行う
        PhotonNetwork.ConnectUsingSettings("v0.1");
    }

    private void OnConnectedToMaster()
    {
        Debug.Log("JoinedTheServer");
    }

    private void OnPhotonRandomJoinFailed()
    {
        Debug.Log("Can't join random room");
    }

    private void OnJoinedRoom()
    {
        Debug.Log("True");
    }

    private void OnGUI()
    {
        GUILayout.Label(PhotonNetwork.connectionStateDetailed.ToString());
    }
}
