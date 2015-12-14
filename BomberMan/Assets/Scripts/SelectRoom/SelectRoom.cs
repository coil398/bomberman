using UnityEngine;
using System.Collections;

class SelectRoom : MonoBehaviour
{
	private int roomNumber;
	private string whichRoom;

	public SelectRoom(int roomNumber)
	{
		this.roomNumber = roomNumber;
		StageSceneLoad ();
	}

	public void StageSceneLoad()
	{
		whichRoom = "Room" + roomNumber;
		Application.LoadLevel (whichRoom);
	}
}
