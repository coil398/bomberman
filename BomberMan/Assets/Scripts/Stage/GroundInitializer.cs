using UnityEngine;
using System.Collections;

public class GroundInitializer : MonoBehaviour {
	#region fields for backgrounds

	public Transform groundTile;

	public Vector3 initialPoint;

	public Vector2 stride = new Vector2(1,1);

	public Vector2 counts = new Vector2(100,100);

	public Transform backgroundParent;

	#endregion

	public Transform solidBlock;

	public Transform explodableBlock;


	// Use this for initialization
	void Start () {
		for (int i = 0; i < this.counts.x; i++)
			for (int j = 0; j < this.counts.y; j++) {
			 Transform cloned = (Transform)GameObject.Instantiate(this.groundTile,new Vector3(this.initialPoint.x + this.stride.x * i,this.initialPoint.y + this.stride.y * j,0),Quaternion.identity);
			cloned.parent = this.backgroundParent;
		}

	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
