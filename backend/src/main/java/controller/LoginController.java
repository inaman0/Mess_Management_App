package controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import platform.resource.login;
import service.LoginService;

/**
 * Created by shraddha on 06-Oct-16.
 */
@RestController
@RequestMapping("/api/login")
class LoginController extends BaseController {
    protected boolean isLoginRequired() {
        return false;
    }
    public LoginController() {
        super(new login(),new LoginService());
    }
}