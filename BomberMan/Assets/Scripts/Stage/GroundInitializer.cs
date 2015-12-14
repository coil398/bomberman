using UnityEngine;
using System.Collections;

public class GroundInitializer : MonoBehaviour {
	#region fields for backgrounds

	public Transform groundTile;

	public Vector3 initialPoint;

	public Vector2 stride = new Vector2(1,1);

	public Vector2 counts = new Vector2(100,100);

	public Transform backgroundParent;

	public Transform stageObjectParent;

	#endregion

	public Transform[] mapObjects;

	// Use this for initialization
	void main () {
		for (int i = 0; i < this.counts.x; i++)
			for (int j = 0; j < this.counts.y; j++) {
			 Transform cloned = (Transform)GameObject.Instantiate(this.groundTile,new Vector3(this.initialPoint.x + this.stride.x * i,this.initialPoint.y + this.stride.y * j,0),Quaternion.identity);
			 cloned.parent = this.backgroundParent;
		}
		Object objectText = Resources.Load ("map1");//TODO this should be dynamic
		TextAsset stageData = objectText as TextAsset;
		StageDataScheme data = LitJson.JsonMapper.ToObject<StageDataScheme> (stageData.text);
		for (int x = 0; x < data.width; x++)
			for (int y = 0; y < data.height; y++) {
			uint blockIndex = data.stage[data.width * y + x];
			Transform cloned = (Transform)GameObject.Instantiate(this.mapObjects[blockIndex],new Vector3(this.initialPoint.x + this.stride.x * x,this.initialPoint.y + this.stride.y * y,this.stageObjectParent.transform.position.z),Quaternion.identity);
			cloned.parent = this.stageObjectParent;
		}
	}
	
	// Update is called once per frame
	void Update () {
	}
}
