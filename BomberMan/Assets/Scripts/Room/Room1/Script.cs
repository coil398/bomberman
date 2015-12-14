using UnityEngine;
using System.Collections;

public class Script : MonoBehaviour
{
    RoomScript room1;
    void awake()
    {
        room1 = new RoomScript();
    }
}
