import os
import json

def getSensorData():
	try:
		os.system("curl -s -u root:arduino http://localhost/data/get > result.json")
		return json.loads(file("result.json").read())
	except Exception:
		return None

import SocketServer

class MyTCPHandler(SocketServer.BaseRequestHandler):
    """
    The RequestHandler class for our server.

    It is instantiated once per connection to the server, and must
    override the handle() method to implement communication to the
    client.
    """

    def handle(self):
        # self.request is the TCP socket connected to the client
        data = self.request.recv(1024).strip()

	if data == "R":
		sensorData = getSensorData()[u"value"]
		if not sensorData:
			self.request.sendAll("0.00 0.00")
		else:
			self.request.sendall(sensorData[u"s1"]+" "+sensorData[u"s2"])
	else:
		self.request.sendall("OK")


if __name__ == "__main__":
    HOST, PORT = "0.0.0.0", 299

    server = SocketServer.TCPServer((HOST, PORT), MyTCPHandler,bind_and_activate=False)
    server.allow_reuse_address = True
    server.server_bind()
    server.server_activate()

    # Activate the server; this will keep running until you
    # interrupt the program with Ctrl-C

    try:
        server.serve_forever()
    except Exception:
        pass
    server.shutdown()
