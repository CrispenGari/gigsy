from flask import Blueprint, make_response, jsonify, request
from PIL import Image
import io
import numpy as np
from deepface import DeepFace
import requests


blueprint = Blueprint("blueprint", __name__)


class DeepFaceContainer:
    def validate_face(image):
        faces = DeepFace.extract_faces(
            image,
            detector_backend="skip",
            enforce_detection=True,
        )
        return len(faces) == 1

    def verify_face(img1, img2):
        result = DeepFace.verify(
            img1,
            img2,
            model_name="VGG-Face",
            detector_backend="opencv",
            distance_metric="cosine",
            align=True,
            enforce_detection=False,
            anti_spoofing=False,
        )
        return result["verified"]


@blueprint.route("v1/find-face", methods=["POST"])
def validate_face():
    if request.method == "POST":
        if request.files.get("image"):
            # read the image in PIL format
            image = request.files.get("image").read()
            image = Image.open(io.BytesIO(image))
            image = np.asarray(image)
            return make_response(
                jsonify({"valid": DeepFaceContainer.validate_face(image)})
            ), 200
    return make_response(jsonify({"valid": False})), 200


@blueprint.route("v1/verify-face", methods=["POST"])
def verify_face():
    if request.method == "POST":
        if request.files.get("pose"):
            url = request.form.get("avatar")
            pose = request.files.get("pose").read()
            pose = Image.open(io.BytesIO(pose))
            pose = np.asarray(pose)
            response = requests.get(url)
            avatar = Image.open(io.BytesIO(response.content))
            avatar = np.asanyarray(avatar)

            if not DeepFaceContainer.validate_face(avatar):
                return make_response(jsonify({"verified": False})), 200

            if not DeepFaceContainer.validate_face(pose):
                return make_response(jsonify({"verified": False})), 200

            return make_response(
                jsonify({"verified": DeepFaceContainer.verify_face(avatar, pose)})
            ), 200

    return make_response(jsonify({"verified": False})), 200
