import requests as r

print("Welches Item ?")
name = input()
print("Wie viele ?")
number = input()
print("Wer hat es ?")
user = input()
print("Wo ist es ?")
location = input()

response = r.post("http://127.0.0.1:8000/put", json={"name": name, "number": number, "user": user, "location": location})

print(response.json())