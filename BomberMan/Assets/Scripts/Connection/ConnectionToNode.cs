using UnityEngine;
using System.Collections;
using System;
using System.IO;
using System.Net.Sockets;

delegate void GetRoomList();

public class ConnectionToNode : MonoBehaviour
{
	internal Boolean socketReady = false;

	TcpClient mySocket;
	NetworkStream theStream;
	StreamWriter theWriter;
	StreamReader theReader;
	String Host = "127.0.0.1";
	Int32 Port = 7000;

	void Start()
	{
		Debug.Log("socket start\n");
		Boolean b = Security.PrefetchSocketPolicy("127.0.0.1",7000,3000);
		Debug.Log("b:"+b);
		setupSocket();
		writeSocket("aaaaaaaaa");
	}

	void Update(){}

	// Initialize a socket
	public void setupSocket()
	{
		try
		{
			mySocket = new TcpClient(Host,Port);
			theStream = mySocket.GetStream();
			theWriter = new StreamWriter(theStream);
			theReader = new StreamReader(theStream);
			socketReady = true;
		}
		catch(Exception e)
		{
			Debug.Log("Socket error: " + e);
		}
	}

	// Sending data to the socket
	public void writeSocket(string theLine)
	{
		if(!socketReady)return;

		String foo = theLine + "\n";
		theWriter.Write(foo);
		theWriter.Flush();
	}

	// Reading from the socket
	public String readSocket()
	{
		if(!socketReady)return "";

		if(theStream.DataAvailable)return theReader.ReadLine();

		return "";
	}

	// Disconnecting the socket
	public void closeSocket()
	{
		if(!socketReady)return;

		theWriter.Close();
		theReader.Close();
		mySocket.Close();
		socketReady = false;
	}


}
