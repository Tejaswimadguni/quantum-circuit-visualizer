import json, urllib.request, math

bell_payload = [
  {"gate":"H","qubit":0,"column":0},
  {"gate":"CNOT","control":0,"target":1,"column":1,"qubit":0}
]

qft3_payload = [
  {"gate":"H","qubit":0,"column":0},
  {"gate":"CP","qubit":0,"control":0,"target":1,"column":1,"angle":%f},
  {"gate":"CP","qubit":0,"control":0,"target":2,"column":2,"angle":%f},
  {"gate":"H","qubit":1,"column":3},
  {"gate":"CP","qubit":1,"control":1,"target":2,"column":4,"angle":%f},
  {"gate":"H","qubit":2,"column":5},
  {"gate":"MEASURE","qubit":0,"column":6},
  {"gate":"MEASURE","qubit":1,"column":6},
  {"gate":"MEASURE","qubit":2,"column":6}
]

qft3_payload = json.loads(json.dumps(qft3_payload) % (math.pi/2, math.pi/4, math.pi/2))

headers = {'Content-Type': 'application/json'}


def post(payload):
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request('http://127.0.0.1:5000/simulate-with-steps', data=data, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            print('STATUS', resp.status)
            body = resp.read().decode()
            print('BODY', body)
    except Exception as e:
        print('EXCEPTION', repr(e))

print('Posting Bell payload...')
print(json.dumps(bell_payload, indent=2))
post(bell_payload)

print('\nPosting QFT3 payload...')
print(json.dumps(qft3_payload, indent=2))
post(qft3_payload)
