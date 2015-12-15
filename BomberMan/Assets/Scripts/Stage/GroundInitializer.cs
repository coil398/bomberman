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

	public Transform charatcer;

	#endregion

	public Transform[] mapObjects;

	public Transform[] instanciatedStageObjects;

	// Use this for initialization
	void Start() {
		for (int i = 0; i < this.counts.x; i++)
			for (int j = 0; j < this.counts.y; j++) {
			 Transform cloned = (Transform)GameObject.Instantiate(this.groundTile,new Vector3(this.initialPoint.x + this.stride.x * i,this.initialPoint.y + this.stride.y * j,0),Quaternion.identity);
			 cloned.parent = this.backgroundParent;
			cloned.position += this.backgroundParent.transform.position;
		}
		Object objectText = Resources.Load ("map1");//TODO this should be dynamic
		TextAsset stageData = objectText as TextAsset;
		StageDataScheme data = JsonUtility.FromJson<StageDataScheme> (stageData.text);
		this.instanciatedStageObjects = new Transform[data.width * data.height];
		for (int x = 0; x < data.width; x++)
			for (int y = 0; y < data.height; y++) {
			uint blockIndex = data.stage[data.width * y + x];
			Transform cloned = (Transform)GameObject.Instantiate(this.mapObjects[blockIndex],new Vector3(this.initialPoint.x + this.stride.x * x,this.initialPoint.y + this.stride.y * y,this.stageObjectParent.transform.position.z),Quaternion.identity);
			cloned.parent = this.stageObjectParent;
			cloned.transform.position += cloned.parent.position;
			this.instanciatedStageObjects [data.width * y + x] = cloned;
		}
		MapCoordinate initialPoint = data.initialPoints [Random.Range (0, data.initialPoints.Length)];
		Transform initialPointObject = this.instanciatedStageObjects [data.width *  initialPoint.x + initialPoint.y];
		Transform clonedCharacter = (Transform)GameObject.Instantiate (this.charatcer);
		clonedCharacter.position = this.backgroundParent.position + initialPointObject.localPosition + new Vector3 (0.5f, 0.5f,0);
		clonedCharacter.position = new Vector3 (clonedCharacter.position.x, clonedCharacter.position.y, -5);
	}
	
	// Update is called once per frame
	void Update () {
	}
}
