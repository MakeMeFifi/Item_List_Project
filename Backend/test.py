import requests as r

response = r.put("http://192.168.2.35:8000/putUser", json={"firstname": "Chris", "lastname": "Mikolajek"})
print(response.json())