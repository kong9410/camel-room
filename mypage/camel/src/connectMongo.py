from pymongo import MongoClient
import bcrypt
class connMongo:

    #몽고DB 초기화
    def __init__(self):
        self.port='27017'
        self.conn = MongoClient("mongodb://127.0.0.1/" + self.port)
        self.db = self.conn.get_database('estate_db')

        #패스워드 암호화
        self.salt = bcrypt.gensalt()

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
        password = bcrypt.hashpw(password.encode('utf-8'), self.salt)
        self.col.insert({"email":email, "password":password,
                         "username":username, "dob":dob,
                         "tel":tel, "address":address})
        print('data insert complete!')

    #로그인시 계정 확인
    def findUser(self, id, password):
        self.col = self.db.get_collection('user')
        print(password)
        accountInfo = self.col.findOne({"email":id})
        if(accountInfo == None):
            return False
        dbPassword = accountInfo['password']
        hash = bcrypt.hashpw(dbPassword.encode('utf-8'), self.salt)
        hashedPassword = bcrypt.checkpw(password.encode('utf-8'), hash)
        print(hashedPassword)
        if(hashedPassword):
            return True
        return False

