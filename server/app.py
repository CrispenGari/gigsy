import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
from api import app
from flask import make_response, jsonify
from blueprints import blueprint

app.register_blueprint(blueprint, url_prefix="/api")

class AppConfig:
    PORT = 3001
    DEBUG = True


@app.route("/", methods=["GET"])
def meta():
    meta = {
        "project": "gigsy",
    }
    return make_response(jsonify(meta)), 200



if __name__ == "__main__":
    app.run(
        debug=AppConfig().DEBUG,
        port=AppConfig().PORT,
    )

    