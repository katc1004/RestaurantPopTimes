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
		# maps index to name, address, location, placeids, open, busy and busy percentage
		self.place_ids_to_info = defaultdict(lambda:{})

	'''
	input: single place_id, string
	output: a list of size 24
	description: returns the current day of the week's 24 hour busy percentage
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
	input: address string
	output: location (lat, lng)
	description: finds the geo location of an address
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
	input: nearby places data, busy percentage range
	output: nothing
	description: finds all the information of each place id and their name, address, location, open, busy and busy percentage
	only save the ones that satisfy the busy percentage range and ones that are currently open
	'''
	def grab_info(self, data, busy):
		minbusy, maxbusy = busy
		counter = 0
		for i in (data['results']):
			try:
				checkbusy = self.get_popular_times_helper((i['place_id']))[self.time]
				if ((i['opening_hours']['open_now'] == True) and (checkbusy >= minbusy) and (checkbusy < maxbusy)):
					self.place_ids_to_info[counter]['placeid'] = (i['place_id'])
					self.place_ids_to_info[counter]['open'] = i['opening_hours']['open_now']
					self.place_ids_to_info[counter]['name'] = i['name']
					self.place_ids_to_info[counter]['address'] = i['vicinity']
					self.place_ids_to_info[counter]['lat'] = i['geometry']['location']['lat']
					self.place_ids_to_info[counter]['lng'] = i['geometry']['location']['lng']
					busy = ""
					if minbusy == 0 and maxbusy == 25:
						busy = "Not busy"
					elif minbusy == 25 and maxbusy == 50:
						busy = "Not too busy"
					elif minbusy == 50 and maxbusy == 75:
						busy = "Busy"
					else:
						busy = "As busy as it gets"
					self.place_ids_to_info[counter]['busy'] = busy
					self.place_ids_to_info[counter]['busypercentage'] = checkbusy
					counter += 1
			except:
				pass
	'''
	input: 
	1) address, string
	2) radius, int in meters
	3) busy, tuple(minbusy, minbusy) in percentage
	output: a list of places that are currently open and satisfy user's range filter along with all their information
	description: 
	First, finds the lat,lng location of the address and then do a nearby search request using google maps api
	Google maps api then returns all the nearby restaurants and we use this data to parse through information and save the ones
	that are relevant
	Return this list of places
	'''
	def main(self, address, radius, busy):
		lat, lng = self.find_location(address)

		# Nearby Search request
		with urllib.request.urlopen("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + str(lat) + "," + str(lng) + "&radius=" + str(radius) + "&type=restaurant" + "&key=" + API_KEY) as url:
			data = json.loads(url.read().decode())

		print(data)
		# grab all info 
		self.grab_info(data, busy)

		return self.place_ids_to_info