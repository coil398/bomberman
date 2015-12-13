using UnityEngine;
using System.Collections;

public class PlayerCharacterMotionProvider : CharacterMotionProvider {
	protected override Vector2 getMovedVector ()
	{
		float horizontal = Input.GetAxisRaw ("Horizontal");
		float vertical = Input.GetAxisRaw ("Vertical");
		if (horizontal != 0)
			return new Vector2 (horizontal, 0);
		else
			return new Vector2 (0, vertical);
	}
}
