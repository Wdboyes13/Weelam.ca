import os

import requests
import flask
from flask import (
    Flask,
    Response,
    redirect,
    render_template_string,
    request,
    send_from_directory,
)

app = Flask(__name__)

@app.after_request
def inject_headers(response: Response):
    response.headers["X-SuperSecret"] = "https://youtu.be/dQw4w9WgXcQ"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Strict-Transport-Security"] = (
        "max-age=31536000; includeSubDomains; preload"
    )
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


@app.route("/games/devwordle.weelam.ca")
def devwordle():
    return redirect("https://devwordle.weelam.ca", code=301)

@app.route("/secret/")
def secret():
    return redirect("https://youtu.be/dQw4w9WgXcQ", code=301)


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


@app.route("/pins")
def pins():
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


@app.route("/cconv/convert", methods=["POST"])
def convert_currency():
    try:
        from_currency = request.form.get("from")
        to_currency = request.form.get("to")
        amount = float(request.form.get("amnt", 0))

        api_url = f"https://api.frankfurter.dev/v1/latest?base={from_currency}&symbols={to_currency}"
        response = requests.get(api_url)

        # Check if the request was successful
        if response.status_code != 200:
            return f"API Error: {response.status_code}", 400

        data = response.json()

        # Check if the API returned an error
        if "error" in data:
            return f"Currency API Error: {data['error']}", 400

        # Check if rates key exists and contains the target currency
        if "rates" not in data or to_currency not in data["rates"]:
            return f"Invalid currency code: {to_currency}", 400

        converted = round(amount * data["rates"][to_currency], 2)

        template = """
        <!DOCTYPE html>
        <html>
        <head><title>Result</title></head>
        <body>
        <script>
        document.addEventListener("DOMContentLoaded", () => {
            alert("{{ amount }} {{ from_currency }} is {{ converted }} {{ to_currency }}");
            window.location.href = "/cconv";
        });
        </script>
        </body>
        </html>
        """

        return render_template_string(
            template,
            amount=amount,
            from_currency=from_currency,
            converted=converted,
            to_currency=to_currency,
        )

    except ValueError:
        return "Invalid amount provided", 400
    except requests.RequestException as e:
        return f"Network error: {str(e)}", 500
    except Exception as e:
        return f"Unexpected error: {str(e)}", 500

@app.route("/docs/<project>")
def redirect_docs(project):
    return redirect(f"/docs/{project}/", code=301)

@app.route("/docs/<project>/")
@app.route("/docs/<project>/<path:filename>")
def serve_docs(project, filename=None):
    if project == "pyaudiosynth":
        docs_dir = os.path.abspath('../pysynth/docs/_build/html')
        if filename is None:
            filename = 'index.html'

        return send_from_directory(docs_dir, filename)
    else:
        return flask.abort(404)

from whitenoise import WhiteNoise
app.wsgi_app = WhiteNoise(app.wsgi_app, root='www/', index_file='index.html')

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=8000)
