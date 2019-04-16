from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from urllib.parse import quote_plus
import bcrypt
class connMongo:

    #몽고DB 초기화
    def __init__(self):
        self.port='27017'
        host = 'gnits'
        user = 'gnits'
        password = '1234'
        #self.conn = []
        url = "mongodb://%s:%s@%s" % (quote_plus(user), quote_plus(password), host) 
        self.conn = MongoClient(url)
        #self.conn = MongoClient('/tmp/mongodb-27017.sock')
        #self.conn = MongoClient("mongodb://127.0.0.1/" + self.port)
        self.db = self.conn['estate_db']
        self.db.authenticate('gnits', '1234')
        
        #패스워드 암호화
        #self.salt = bcrypt.gensalt()

    #아이디 중복체크
    def check_id(self, email):
        self.col = self.db.get_collection('user')
        if(self.col.find({email:email})):
            return False
        return True

    #회원가입
    def user_insert(self, email, password, username, dob, tel, address):
        self.col = self.db.get_collection('user')
        #mydict = {email, password, username, dob, tel, address}
        print(password)
        #password = bcrypt.hashpw(password.encode('utf-8'), self.salt)
        self.col.insert({"email":email, "password":password,
                         "username":username, "dob":dob,
                         "tel":tel, "address":address})
        print('data insert complete!')

    #로그인시 계정 확인
    def findUser(self, id, password):
        self.col = self.db.get_collection('user')
        #print(password)
        accountInfo = self.col.find_one({"email":id})
        if(accountInfo == None):
            return False
        #dbPassword = accountInfo['password']
        
        #print(dbPassword)
        #hash = bcrypt.hashpw(dbPassword, self.salt)
        #print(hash)
        #if(bcrypt.checkpw(password.encode('utf-8'), hash)):
        #    return True
        if(self.col.find_one({"email":id, "password":password})):
            return True
        return False

    #매물 등록함수, 제목, 이미지url, 주거구분, 계약구분, 가격, 보증금, 주소, 평수, 방개수, 화장실, 층수, 내용
    def estate_insert(self, title, image_url, houseType, contractTag, price, endorsementFee, homeAddress, roomSize, rooms, toilet, floors, text):
        self.col = self.db.get_collection('houses')
        self.col.insert({"title":title, "imageURL":image_url, "houseType":houseType, "contractTag":contractTag, 
        "price":price, "endorsementFee":endorsementFee, "homeAddress":homeAddress, 
        "roomSize":roomSize, "rooms":rooms, "toilet":toilet, "floors":floors, "text":text})


