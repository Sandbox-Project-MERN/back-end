const AuthService = require("../auth/auth-service");

async function requireAuth(req, res, next) {
  const authToken = req.get("authorization") || "";

  let bearerToken;
  if (!authToken.toLowerCase().startsWith("bearer "))
    return next({ status: 401, message: "Missing bearer token" });
  else bearerToken = authToken.slice(7, authToken.length);

  try {
    const payload = AuthService.verifyJwt(bearerToken);

    const user = await AuthService.getUserWithEmail(payload.sub);
    if (!user) return next({ status: 401, message: "Unauthorized request" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return next({ status: 401, message: "Unauthorized request" });
  }
}

function checkUserInfo(req, res, next) {
  const authToken = req.get("authorization") || "";

  let bearerToken = authToken.slice(7, authToken.length);

  if (!bearerToken) next();
  else {
    const payload = AuthService.verifyJwt(bearerToken);

    AuthService.getUserWithEmail(payload.sub)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  }
}

module.exports = {
  requireAuth,
  checkUserInfo,
};
