const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const authConfig = require("../config/config");
//const TokenBlacklist = require("../blacklist-token/blacklist.model");

const _checkUserToken = async (userToken) => {
  const decoded = jwt.verify(userToken, authConfig.key);
  if (!decoded.params.id) {
    throw Error("Invalid token!");
  } else {
    const idDecoded = decoded.params.id;
    // const _verificaUsuarioBlackList = async function (token) {
    //   const verify = await TokenBlacklist.findOne({ token: token });
    //   return verify;
    // };

    // if (await _verificaUsuarioBlackList(userToken)) {
    //   throw Error("Sorry! Your session has expired!");
    // }

    return idDecoded;
  }
};

const _getUserId = async (authHeader) => {
  if (!authHeader) {
    throw new Error("Token not informed!");
  }
  const parts = authHeader.split(" ");
  if (!parts.length === 2) throw Error("Token error!");
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    throw Error("Invalid token format!");
  }

  return await _checkUserToken(token);
};

const _getUserPermissions = async (user) => {
  const userPermissions = [];
  if (user["__t"] && user["__t"] == "ADMIN") {
    userPermissions.push("ADMIN");
  }
  return userPermissions;
};

const _checkIfUserHasPermission = (roleType, routerPermissions) => {
  const filterPermissions = routerPermissions.filter(
    (permission) => permission === roleType
  );
  return !!filterPermissions.length;
};

const authMiddleware = (roles) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const userId = await _getUserId(authHeader);
    const user = await User.findOne({ _id: userId });

    if (!user) throw Error("The user does not exist!");

    const hasPermission = _checkIfUserHasPermission(user.roleType, roles);

    if (!hasPermission) return res.status(401).json("You're not authorized!");

    req.userPermissions = user.roleType;
    req.userId = userId;
    req.user = user;

    return next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

module.exports = authMiddleware;
