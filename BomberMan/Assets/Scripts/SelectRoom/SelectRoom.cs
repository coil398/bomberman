using UnityEngine;
using System.Collections;

class SelectRoom : MonoBehaviour
{
	private string roomNumber;
	private string whichRoom;


	public void ClickToSelectRoom(int room)
	{
		this.roomNumber = room.ToString();
		if(!ConnectToTheRoom())
		{
			if(PhotonNetwork.CreateRoom(roomNumber))
			{
				Debug.Log("The room created");
			}
		}
	}

	public bool ConnectToTheRoom()
	{
		if(PhotonNetwork.JoinRoom(roomNumber))
		{
			Debug.Log("Joined the room");
			return true;
		}
		return false;
	}

	public void StageSceneLoad()
	{
		whichRoom = "Room" + roomNumber;
		Application.LoadLevel (whichRoom);
	}

	private void OnJoinedRoom()
    {
        Debug.Log("True");
		StageSceneLoad();
    }
}
