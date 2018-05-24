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
		self.place_ids_to_info = defaultdict(lambda:{})

	'''
	input: single place_id, string
	output: a list of lists int
	description: returns all popular times in 24 hour day for each day of the week based on the place_id
	'''
	def get_popular_times_helper(self, place_id):
		data = []
		counter = 0
		try:
			for i in dict(populartimes.get_id(API_KEY, place_id))['populartimes']:
				if(counter == self.day):
					return i['data']
				counter += 1
		except:
			return None

	'''
	input: nearby search request data, json
	output: None
	description: maps each place_id to whether a boolean value of wehther it's open right now or not
	
	def get_open_now(self, data):
		for i in (data['results']):
			try:
				self.place_ids_to_open_now[(i['place_id'])] = i['opening_hours']['open_now']
			except:
				self.place_ids_to_open_now[(i['place_id'])] = False
	'''
	'''
	input: nearby search request data, json
	output: None
	description: maps each place_id to a list of lists of popular times
	
	def get_popular_times(self, data):
		for i in (data['results']):
			popular_times_list = self.get_popular_times_helper((i['place_id']))
			try:
				return popular_times_list[14]
			except:
				return None
	'''
	def find_location(self, address):
		# get current location (lat,lng) of address
		with urllib.request.urlopen("https://maps.googleapis.com/maps/api/geocode/json?address=" + address.replace(" ","+") + "&key=" + API_KEY) as url:
			data = json.loads(url.read().decode())

		for i in (data['results']):
			lat = (i['geometry']['location']['lat'])
			lng = (i['geometry']['location']['lng'])

		return (lat,lng)
	'''
	def find_name(self, placeid, data):
		for i in (data['results']):
			if i['place_id'] == placeid:
				return i['name']

	def find_address(self, placeid, data):
		for i in (data['results']):
			if i['place_id'] == placeid:
				return i['vicinity']
	'''
	def grab_info(self, data, busy):
		minbusy, maxbusy = busy

		for i, elem in enumerate(data['results']):
			try:
				checkbusy = self.get_popular_times_helper((elem['place_id']))[self.time]
				if ((elem['opening_hours']['open_now'] == True) and (checkbusy >= minbusy) and (checkbusy < maxbusy)):
					self.place_ids_to_info[i]['placeid'] = (elem['place_id'])
					self.place_ids_to_info[i]['open'] = elem['opening_hours']['open_now']
					self.place_ids_to_info[i]['name'] = elem['name']
					self.place_ids_to_info[i]['address'] = elem['vicinity']
					self.place_ids_to_info[i]['lat'] = elem['geometry']['location']['lat']
					self.place_ids_to_info[i]['lng'] = elem['geometry']['location']['lng']
					busy = ""
					if minbusy == 0 and maxbusy == 25:
						busy = "Not busy"
					elif minbusy == 25 and maxbusy == 50:
						busy = "Not too busy"
					elif minbusy == 50 and maxbusy == 75:
						busy = "Busy"
					else:
						busy = "As busy as it gets"
					self.place_ids_to_info[i]['busy'] = busy
					self.place_ids_to_info[i]['busypercentage'] = checkbusy
			except:
				pass
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
		lat, lng = self.find_location(address)

		# Nearby Search request
		with urllib.request.urlopen("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + str(lat) + "," + str(lng) + "&radius=" + str(radius) + "&type=restaurant" + "&key=" + API_KEY) as url:
			data = json.loads(url.read().decode())

		# grab all info 
		self.grab_info(data, busy)

		return self.place_ids_to_info

'''
searchrestaurants = PlaceQuery()
output = searchrestaurants.main('11920 slater st overland park kansas', 1500, (0,50))
print(json.dumps(output))'''


