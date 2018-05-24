import populartimes, datetime, urllib.request, json
from datetime import time
from collections import defaultdict

API_KEY = "AIzaSyCeIk2kOl-d3ENbo7AC855RxAjJug-hOwY"

class PlaceQuery:
	def __init__(self):
		# day of the week, int
		self.day = datetime.datetime.today().weekday()
		# hour of the day range(0, 24), int
		self.time = datetime.datetime.now().hour
		# maps the place_id to a list of popular time from Monday to Sunday
		self.place_ids_to_popular_times = defaultdict(lambda:[])
		# maps the place_id to boolean value of if it's open or not right now
		self.place_ids_to_open_now = defaultdict(lambda:[])

	'''
	input: single place_id, string
	output: a list of lists int
	description: returns all popular times in 24 hour day for each day of the week based on the place_id
	'''
	def get_popular_times_helper(self, place_id):
		data = []

		try:
			for day in dict(populartimes.get_id(API_KEY, place_id))['populartimes']:
				data.append(day['data'])
		except:
			for i in range(7):
				data.append(None)

		return data

	'''
	input: nearby search request data, json
	output: None
	description: maps each place_id to whether a boolean value of wehther it's open right now or not
	'''
	def get_open_now(self, data):
		for i in (data['results']):
			self.place_ids_to_open_now[(i['place_id'])] = i['opening_hours']['open_now']

	'''
	input: nearby search request data, json
	output: None
	description: maps each place_id to a list of lists of popular times
	'''
	def get_popular_times(self, data):
		for i in (data['results']):
			popular_times_list = self.get_popular_times_helper((i['place_id']))
			self.place_ids_to_popular_times[(i['place_id'])] = popular_times_list

	'''
	input: 
	1) address, string
	2) radius, int in meters
	3) busy, tuple(minbusy, minbusy) in percentage
	output: a list of place_ids that are currently open and satisfy user's range filter
	description: 
	First, finds the lat,lng location of the address and then do a nearby search request using google maps api
	Google maps api then returns all the nearby restaurants and this function saves all the place_ids of the nearby restaurants along with information
	about their popular times and whether they are currently open.
	Lastly, we go through and find the places that are currently open and satisfy the busy percentage and return a list
	'''
	def main(self, address, radius, busy):
		# get current location (lat,lng) of address
		with urllib.request.urlopen("https://maps.googleapis.com/maps/api/geocode/json?address=" + address.replace(" ","+") + "&key=" + API_KEY) as url:
		    data = json.loads(url.read().decode())

		for i in (data['results']):
			lat = (i['geometry']['location']['lat'])
			lng = (i['geometry']['location']['lng'])

		# Nearby Search request
		with urllib.request.urlopen("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + str(lat) + "," + str(lng) + "&radius=" + str(radius) + "&type=restaurant" + "&key=" + API_KEY) as url:
		    data = json.loads(url.read().decode())

		# are the places nearby open?
		self.get_open_now(data)
		# get all the popular times of the places nearby
		self.get_popular_times(data)
		
		returnlist = []

		minbusy, maxbusy = busy

		for i in self.place_ids_to_open_now:
			# only look at places that are open
			if self.place_ids_to_open_now[i] == True:
				try:
					temp = self.place_ids_to_popular_times[i][0]
					if temp[self.time] >= minbusy and temp[self.time] < maxbusy and temp != None:
						# add the place id of the place that satisfy busy percentage
						returnlist.append((i, temp[self.time]))
				except:
					pass

		return returnlist
		
'''
bam = PlaceQuery()
output = bam.main("11920 Slater St Overland Park", 1500, (0,20))
'''


