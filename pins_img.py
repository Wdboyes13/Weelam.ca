import os
import requests


def get_pins() -> dict[str, str] | None:
    token = os.getenv("GH_TOKEN")
    if not token:
        print("Error: GH_TOKEN environment variable not set")
        return None
    query = '{user(login: "Wdboyes13") {pinnedItems(first: 3, types: REPOSITORY) {nodes {... on Repository {name url}}}}}'
    headers = {"Authorization": f"bearer {token}", "Content-Type": "application/json"}

    response = requests.post(
        "https://api.github.com/graphql", json={"query": query}, headers=headers
    )

    if response.status_code == 200:
        data = response.json()
        nodes = data["data"]["user"]["pinnedItems"]["nodes"]
        urls = {repo["name"]: repo["url"] for repo in nodes}
        return urls
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None


def format_html():
    data = get_pins()
    if not data:
        return '<h3 class="md-typescale-body-medium">Failed to get pins, please try again later<h3/>'

    result = ""

    base = """
    <a href="{URL}"><img src="https://github-readme-stats.vercel.app/api/pin/?username=wdboyes13&repo={NAME}"/></a>
    """

    for name, url in data.items():
        result += base.format(URL=url, NAME=name)
    return result
