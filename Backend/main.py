from fastapi import FastAPI, Request

app = FastAPI()

list = [{"name": "apple"},
        {"name": "banana"},
        {"name": "cherry"}]


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
    item = data.get("item")
    list.append({"name": item})
    return list