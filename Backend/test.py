import requests as r

response = r.post("http://127.0.0.1:8000/put" , json = {"item" : "peach"})

print(response.json())