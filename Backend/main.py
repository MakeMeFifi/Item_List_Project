from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

#Connection zur DB eröffnen

conn = sqlite3.connect("items.db")
cursor = conn.cursor()
cursor.execute("PRAGMA foreign_keys = ON") # Erlaubt die Nutzung von Fremdschlüsseln in der DB

#-----------------------------------------------------------------------------DB erstellung----------------------------------------------------------
cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT)")
cursor.execute("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, number INTEGER, userID INTEGER, location TEXT, isBought BOOLEAN DEFAULT 0 , FOREIGN KEY(userID) REFERENCES users(id))")
cursor.execute("CREATE TABLE IF NOT EXISTS toDo (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, created DATE, deadline DATE, creater INTEGER,commissioner INTEGER, isDone BOOLEAN DEFAULT 0 , FOREIGN KEY(creater) REFERENCES users(id), FOREIGN KEY(commissioner) REFERENCES users(id))")
conn.commit()
#-----------------------------------------------------------------------------DB erstellung----------------------------------------------------------




class Item:
    def __init__(self, name: str , number: int , user : str,location : str):
        self.name = name
        self.number = number
        self.user = user
        self.location = location
    isBought = False


class ListItem:
    def __init__(self, id : int, name: str , number: int , user : int,location : str, isBought : bool):
        self.id = id
        self.name = name
        self.number = number
        self.user = user
        self.location = location
        self.isBought = isBought


class ToDoItem:
    def __init__(self, id: int, name: str, created: str, deadline: str, creater: int, commissioner: int, isDone: bool):
        self.id = id
        self.name = name
        self.creater = creater
        self.commissioner = commissioner
        self.isDone = isDone
        DBcreated = created.split("-")  # Split the date string into components
        self.created = f"{DBcreated[2]}.{DBcreated[1]}.{DBcreated[0]}"
        DBdeadline = deadline.split("-")    # Split the date string into components
        self.deadline = f"{DBdeadline[2]}.{DBdeadline[1]}.{DBdeadline[0]}"

def addItem(item : Item):
    cursor.execute("INSERT INTO items (name, number, userID, location) VALUES (?,?,?,?)", (item.name, item.number, item.user, item.location))
    conn.commit()
    return True


def deleteAllData():
    cursor.execute("DELETE FROM items")
    conn.commit()
    return True

def switchDateFormate(date):
    split= date.split(".")
    newDate= split[2]+"-"+split[1]+"-"+split[0]
    return newDate


app = FastAPI()

origins = [
    "http://localhost:5173",  # React dev server
    "http://127.0.0.1:5173",  # Optional: for consistency
    "http://127.0.0.1:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],              # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],              # allow all headers
)


@app.get("/getList")
async def getList():
    cursor.execute("SELECT items.id, items.name, items.number, users.userName, items.location, items.isBought FROM items JOIN users ON items.userID = users.id")
    list = []
    data = cursor.fetchall()
    for row in data:
        item = ListItem(row[0], row[1], row[2], row[3], row[4], row[5])
        list.append(item)
    return list

@app.put("/put")
async def putItem(request : Request):    
    data = await request.json()
    item = Item(data["name"], data["number"], data["user"], data["location"])
    addItem(item)
    return True


@app.put("/putUser")
async def putUser(request : Request):
    data = await request.json()
    cursor.execute("SELECT * FROM users WHERE userName=?", (data["username"],))
    if cursor.fetchone() is None:
        cursor.execute("INSERT INTO users (userName) VALUES (?)", (data["username"],))
        conn.commit()
        cursor.execute("SELECT id FROM users WHERE userName=?", (data["username"],))
        id = cursor.fetchone()
        return id[0]
    else:
        print("User already exists")
        return False

@app.post("/login")
async def login(request : Request):
    data = await request.json()
    cursor.execute("SELECT id FROM users WHERE userName=?", (data.get("username"),))
    user = cursor.fetchone()
    if user is None:
        return False
    else:
        return user[0]

@app.delete("/deleteItem")
async def deleteItem(request : Request):
    data = await request.json()
    cursor.execute("DELETE FROM items WHERE id=?", (data["id"],))
    conn.commit()
    return True

@app.post("/changeIsBoughtStatus")
async def changeIsBoughtStatus(request: Request):
    data = await request.json()
    cursor.execute("UPDATE items SET isBought = ? WHERE id = ?", (data["status"], data["id"],))
    conn.commit()
    return True


@app.get("/getToDo")
async def getToDo() :
    cursor.execute("SELECT toDo.id,toDo.name, toDo.created, toDo.deadline, u1.userName AS creater, u2.userName AS commissioner, toDo.isDone FROM toDo JOIN users u1 ON toDo.creater = u1.id JOIN users u2 ON toDo.commissioner = u2.id")
    toDo = cursor.fetchall()
    list = []
    for row in toDo :
        item = ToDoItem(row[0],row[1],row[2],row[3],row[4],row[5],row[6])
        list.append(item)
    return list

@app.get("/getAllUsers")
async def getAllUsers() :
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    list= []
    for user in users:
        list.append({"id" : user[0], "name" : user[1]})
    return list

@app.put("/setNewTask")
async def setNewTask(request: Request) :
    data = await request.json()
    date = switchDateFormate(data["date"])
    deadline = switchDateFormate(data["deadline"])
    cursor.execute("INSERT INTO toDO (name, created, deadline, creater ,commissioner) VALUES (?,?,?,?,?)", (data["name"], date, deadline, data["creater"], data["PersonToDo"]))
    conn.commit()
    return True

@app.post("/changeIsDoneStatus")
async def changeIsDoneStatus(request: Request):
    data = await request.json()
    cursor.execute("UPDATE toDo SET isDone= ? WHERE toDo.id = ?", (data["status"],data["id"]))
    conn.commit()
    return True

@app.delete("/deleteToDo")
async def deleteToDo(request: Request):
    data = await request.json()
    cursor.execute("DELETE FROM toDo WHERE toDo.id = ?",(data["id"],))
    conn.commit()
    return True