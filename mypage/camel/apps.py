from django.apps import AppConfig
from pymongo import MongoClient

# client = MongoClient('mongodb://localhost:27017/')
# db = client.dbName
# collection = db.collectionName
# results = collection.find()
# print(results)

class CamelConfig(AppConfig):
    name = 'camel'
