using UnityEngine;
using System.Collections;

public class PlayerCharacterMotionProvider : CharacterMotionProvider {

	public float speedFactor = 1f / 100f;

	protected override Vector2 getMovedVector ()
	{
		float horizontal = Input.GetAxisRaw ("Horizontal")*this.speedFactor;
		float vertical = Input.GetAxisRaw ("Vertical")*this.speedFactor;
		if (horizontal != 0)
			return new Vector2 (horizontal, 0);
		else
			return new Vector2 (0, vertical);
	}
}
