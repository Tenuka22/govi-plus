from django.http import HttpRequest
from ninja import Schema
from ninja_jwt.controller import NinjaJWTDefaultController
from ninja_extra import NinjaExtraAPI
from ninja_jwt.authentication import JWTAuth

api = NinjaExtraAPI()
api.register_controllers(NinjaJWTDefaultController)  # type: ignore
api.add_router("/farmers/", "farmer.api.router")


class UserSchema(Schema):
    username: str
    is_authenticated: bool
    email: str | None = None


@api.get("/test")
def test(request: HttpRequest) -> str:
    print(request)
    return "Stats: OK"


@api.get("/user", response=UserSchema, auth=JWTAuth())
def user(request: HttpRequest) -> UserSchema:
    user = request.user
    print(user)
    return UserSchema(
        username=user.username,
        is_authenticated=user.is_authenticated,
        email=getattr(user, "email", None),
    )
