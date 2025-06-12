from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

#Connection zur DB eröffnen

conn = sqlite3.connect("items,db")
cursor = conn.cursor()

#-----------------------------------------------------------------------------DB erstellung----------------------------------------------------------
cursor.execute("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, number INTEGER, user TEXT, location TEXT, isBought BOOLEAN DEFAULT 0)")
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
    def __init__(self, id : int, name: str , number: int , user : str,location : str, isBought : bool):
        self.id = id
        self.name = name
        self.number = number
        self.user = user
        self.location = location
        self.isBought = isBought


def addItem(item : Item):
    cursor.execute("INSERT INTO items (name, number, user, location) VALUES (?,?,?,?)", (item.name, item.number, item.user, item.location))
    return True

def getAllItems():
    cursor.execute("SELECT* FROM items")
    list = []
    row = cursor.fetchall()
    for result in row:
        item = ListItem(result[0], result[1], result[2], result[3], result[4], result[5])
        list.append(item)
    return list

def deleteAllData():
    cursor.execute("DELETE FROM items")
    return True

app = FastAPI()

origins = [
    "http://localhost:5173",  # React dev server
    "http://127.0.0.1:5173",  # Optional: for consistency
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],              # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],              # allow all headers
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/items")
async def items():
    return getAllItems()

@app.get("/items/{id}")
async def getOneItem(id):
    return list[int(id)]

@app.put("/put")
async def putItem(request : Request):    
    data = await request.json()
    item = Item(data["name"], data["number"], data["user"], data["location"])
    addItem(item)
    return getAllItems()

@app.delete("/delete")
async def deleteLastItem():
    if len(list) == 0:
        return list
    list.pop()
    return list

@app.delete("/delete_item")
async def deleteItem(request : Request):
    data = await request.json()
    list.remove(data["name"])
    return list

@app.delete("/delete_all")
async def deleteAllItems():
    deleteAllData()
    return getAllItems()