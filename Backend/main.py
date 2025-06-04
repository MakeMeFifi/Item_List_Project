from fastapi import FastAPI, Request

class Item:
    def __init__(self, name: str , number: int , user : str,location : str, isBought : bool):
        self.name = name
        self.number = number
        self.user = user
        self.isBought = isBought
        self.location = location


app = FastAPI()

list = []


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/items")
async def items():
    return list

@app.get("/items/{id}")
async def getOneItem(id):
    return list[int(id)]

@app.post("/put")
async def putItem(request : Request):
    data = await request.json()
    item = Item(data["name"], data["number"], data["user"],data["location"], False)
    list.append(item)
    return list