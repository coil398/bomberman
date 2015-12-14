using UnityEngine;

public class RoomScript : Photon.MonoBehaviour{

    void Awake()
    {
        // マスターサーバへ接続
        PhotonNetwork.ConnectUsingSettings("v0.1");
    }

    void Update()
    {

    }

    void OnJoinedLobby()
    {
        PhotonNetwork.JoinRandomRoom();
    }

    void OnPhotonRandomJoinFailed()
    {
        Debug.Log("ルームへの参加に失敗しました");
    }

    void OnJoinedRoom()
    {
        Debug.Log("ルームへの参加に成功しました");
    }

    void OnGUI()
    {
        GUILayout.Label(PhotonNetwork.connectionStateDetailed.ToString());
    }

}
