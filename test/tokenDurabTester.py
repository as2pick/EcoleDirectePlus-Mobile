import requests
import json
import time

urlc = "https://api.ecoledirecte.com/v3/login.awp?gtk=1&v=4.79.0"
url = "https://api.ecoledirecte.com/v3/login.awp?v=4.79.0"
api_url = "https://api.ecoledirecte.com/v3/rdt/sondages.awp?verbe=get&v=4.79.0"
user_agent = "Mozilla/5.0 (X11; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0"

def grab_token():
    headersc = {
        'User-Agent': user_agent
    }
    responsec = requests.get(urlc, headers=headersc)
    cookies_dict = responsec.cookies.get_dict()

    gtk = cookies_dict.get('GTK')
    
    cookie_name = list(cookies_dict.keys())[0]
    data = {
        "identifiant": "EDELEVE",
        "motdepasse": "@plim2023-2024",
        "isReLogin": False,
        "uuid": "",
        "fa": []
    }

    cookie_header = f"GTK={gtk}; {cookie_name}={gtk}"
    

    headers = {
        'User-Agent': user_agent,
        'X-GTK': gtk,
        "Cookie": cookie_header,
    }
    
    response = requests.post(url, headers=headers, data=f"data={json.dumps(data)}")
    return response.json().get("token")

def test_token_durab(connection_token):
    headers = {
        "X-Token": connection_token,
        'User-Agent': user_agent

    }
    response = requests.post(api_url, headers=headers, data="data={}")
    return response

token = grab_token()
print("TOKEN :", token)

wait_minutes = 20
total_elapsed_minutes = 0

while True:
    response = test_token_durab(connection_token=token)
    status_code = response.json().get("code")
    
    if status_code != 200:
        print(f"Invalid Token after {total_elapsed_minutes} minutes. Code: {status_code}")
        print(response.text)
        break
    else:
        print(f"[{total_elapsed_minutes} min] Valid Token. Current token: '{token}'.")
        print(response.text)
        print(status_code)

    print(f"Wating of {wait_minutes} minutes...\n")
    time.sleep(wait_minutes * 60)

    total_elapsed_minutes += wait_minutes
    wait_minutes += 1