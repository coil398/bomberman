using System;

[Serializable]
public class StageDataScheme
{
	public int width;

	public int height;

	public uint[] stage;

	public MapCoordinate[] initialPoints;
}

[Serializable]
public class MapCoordinate
{
	public uint x;

	public uint y;
}