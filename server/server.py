# server.py
from flask import Flask, render_template, jsonify, request
from main import PlaceQuery
import random, json

app = Flask(__name__, static_folder="../static/dist", template_folder="../static")

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/search")
def search():
	try:
		address = request.args['address']
		radius = int(request.args['radius'])
		if int(request.args['busy']) == 0:
			busy = (0,25)
		elif int(request.args['busy']) == 1:
			busy = (25,50)
		elif int(request.args['busy']) == 2:
			busy = (50, 75)
		else:
			busy = (75,100)
		searchrestaurants = PlaceQuery()
		output = searchrestaurants.main(address, radius, busy)
		return json.dumps(output)
	except:
		return "GET request failed"

if __name__ == "__main__":
	app.run()