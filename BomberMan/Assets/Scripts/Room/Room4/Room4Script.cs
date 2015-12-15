using UnityEngine;
using System.Collections;

public class Room4Script : MonoBehaviour
{
    private int stateTheRoom = 0;
    // 0:empty 1:waiting 2:playing
    // 0の時に入ると部屋が作られる
    // 1の時に入ると部屋に参加できる
    // 2の時は入れない

    public int getState()
    {
        return stateTheRoom;
    }
}
