import UserService from "../services/UserService";
import AuthService from "./AuthService";

const RenderOnAuthenticated = ({ children }) => {
    return (AuthService.isAuthenticated()) ? children : false;
}

export default RenderOnAuthenticated
