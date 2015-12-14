using UnityEngine;
using System.Collections;

public class CharacterMotionProvider : MonoBehaviour {

	private Animator animator;

	public void Start()
	{
		this.animator = this.GetComponent<Animator> ();
	}

	protected virtual Vector2 getMovedVector()
	{
		return Vector2.zero;
	}

	void FixedUpdate()
	{
		Vector2 movedVector = this.getMovedVector ();
		this.animator.SetFloat ("Speed",movedVector.magnitude);
		if (movedVector.x > 0)
			this.CheckRight ();
		else if (movedVector.x < 0)
			this.CheckLeft ();
		else if (movedVector.y > 0)
			this.CheckUp ();
		else if (movedVector.y < 0)
			this.CheckDown ();
		this.transform.position += new Vector3 (movedVector.x, movedVector.y, 0);
	}

	private void CheckLeft()
	{
		this.animator.SetBool ("Left", true);
		this.animator.SetBool ("Right", false);
		this.animator.SetBool ("Up", false);
		this.animator.SetBool ("Down", false);
	}

	private void CheckRight()
	{
		this.animator.SetBool ("Left", false);
		this.animator.SetBool ("Right", true);
		this.animator.SetBool ("Up", false);
		this.animator.SetBool ("Down", false);
	}

	private void CheckUp()
	{
		this.animator.SetBool ("Left", false);
		this.animator.SetBool ("Right", false);
		this.animator.SetBool ("Up", true);
		this.animator.SetBool ("Down", false);
	}

	private void CheckDown()
	{
		this.animator.SetBool ("Left", false);
		this.animator.SetBool ("Right", false);
		this.animator.SetBool ("Up", false);
		this.animator.SetBool ("Down", true);
	}
}
