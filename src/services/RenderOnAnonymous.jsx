import UserService from "../services/UserService";
import AuthService from "./AuthService";

const RenderOnAnonymous = ({ children }) => (!AuthService.isAuthenticated()) ? children : null;

export default RenderOnAnonymous
