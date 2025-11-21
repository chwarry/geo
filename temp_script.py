import json
with open('api-docs.json','r',encoding='utf-8') as f:
    data=json.load(f)
comp=data['components']['schemas']['IPageSjdz']
print(comp)
