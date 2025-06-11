from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware




class Item:
    def __init__(self, name: str , number: int , user : str,location : str, isBought : bool):
        self.name = name
        self.number = number
        self.user = user
        self.isBought = isBought
        self.location = location


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

@app.put("/put")
async def putItem(request : Request):    
    data = await request.json()
    list.append(data["name"])
    return list

@app.delete("/delete")
async def deleteItem():
    if len(list) == 0:
        return list
    list.pop()
    return list