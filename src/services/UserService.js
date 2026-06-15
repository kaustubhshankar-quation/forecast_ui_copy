import Keycloak from "keycloak-js";

const _kc = new Keycloak('/keycloak.json');

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback) => {
  _kc.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256',
  })
    .then((authenticated) => {
      if (!authenticated) {
        console.log("user is not authenticated..!");
      }
      onAuthenticatedCallback();
      isLoggedIn();
    })
    .catch(err => console.log(err));
};

const doLogin = _kc.login;
const doSignUp = _kc.register;
const doCreateAccount = _kc.createAccount;

const doLogout = _kc.logout;

const getToken = () => _kc.token;
const getSessionId = () => _kc.sessionId;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback) =>
  _kc.updateToken(5)
    .then(successCallback)
    .catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;
const getFullName = () => _kc.tokenParsed?.name;
const getEmail = () => _kc.tokenParsed?.email;

const hasRole = (roles) => roles.some((role) => _kc.hasRealmRole(role));

const getAccountUrl = () => _kc.createAccountUrl();
const getUpdatePassword = () => _kc.updatePasswordUrl();

const parseJwt = (token) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
};

const getUserID = () => {
  const token = UserService.getToken();
  if (token) {
    const subs = parseJwt(token);
    const sub = subs.sub;
    return sub;
  }
  else {
    console.error("Could you able to get userId from keycloak UserService.getUserID()");
    return 12345;
  }

};

const UserService = {
  initKeycloak,
  doLogin,
  doSignUp,
  doLogout,
  doCreateAccount,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  hasRole,
  getFullName,
  getEmail,
  getSessionId,
  getAccountUrl,
  getUpdatePassword,
  getUserID
};

export default UserService;
