package service;



import com.google.firebase.auth.hash.Bcrypt;
import org.mindrot.jbcrypt.BCrypt;
import platform.helper.SessionHelper;
import platform.helper.UserHelper;
import platform.manager.GlobalDataManager;
import platform.resource.BaseResource;
import platform.resource.login;
import platform.resource.session;
import platform.resource.user;
import platform.util.ApplicationException;
import platform.util.ExceptionSeverity;
import platform.util.Util;
import platform.webservice.BaseService;
import platform.webservice.ServletContext;

public class LoginService extends BaseService {
    public LoginService() {
        super(new login());
    }

    protected user validate(ServletContext ctx, login _login) throws ApplicationException {
        if (_login.getEmail_id() != null)
            _login.setEmail_id(_login.getEmail_id().toLowerCase());
        user _user = UserHelper.getInstance().getByEmailId(_login.getEmail_id());
        if (_user == null)
            _user = UserHelper.getInstance().getByMobileId(_login.getEmail_id());

        if (_user != null) {
//            if ("Y".equalsIgnoreCase(_user.getLockedEx())) {
//                throw new ApplicationException(ExceptionSeverity.ERROR, "User account is locked");
//            }
            // Generate a salt with a cost factor (e.g., 12 rounds)
   //         String salt = BCrypt.gensalt(10); // 12 is a reasonable default for the cost factor
            // Hash the password with the salt
//            String doubleMd5=  BCrypt.hashpw(_login.getPassword(), salt);
           // String doubleMd5 = Util.doubleMD5(_login.getPassword());
//            if (doubleMd5.equals(_user.getPassword()) ||
//                    _login.getPassword().equals(_user.getPassword())) {
//                System.out.println("Reaching password validation");
//
//                return _user;
//            }

           if( BCrypt.checkpw( _login.getPassword(), _user.getPassword())){
               System.out.println("Reaching password validation");
               return _user;
           }
        }

        if ("admin@ril.com".equalsIgnoreCase(_login.getEmail_id())) {
            BaseResource[] _resources = UserHelper.getInstance().getAll();
            if (Util.isEmpty(_resources)) {
                user _u = new user("admin@ril.com");
                _u.setEmail_id("admin@ril.com");
                _u.setMobile_no("1111111111");
                _u.setName("name");
                if (GlobalDataManager.getInstance().isDomainAMS()) {
                    _u.setType(user.USER_TYPE_DOMAIN_USER);
                } else {
                    _u.setType(user.USER_TYPE_SYSTEM_USER);
                }
                _u.setPassword("ril2013");
                _u.setSuper_user("Y");
                UserHelper.getInstance().add(_u);
                _user = UserHelper.getInstance().getByEmailId(_login.getEmail_id());
                String doubleMd5 = Util.doubleMD5(_login.getPassword());
                if (doubleMd5.equals(_user.getPassword()) ||
                        _login.getPassword().equals(_user.getPassword())) {

                    return _user;
                }
            }
        }
        throw new ApplicationException(ExceptionSeverity.ERROR, "Invalid User Id or Password");
    }


    public void add(ServletContext ctx, BaseResource src) throws ApplicationException {
        login _login = (login) src;
        user _user = validate(ctx, _login);
        String sessionId = Util.getUniqueId();
        session _session = new session();
        _session.setId(sessionId);
        _session.setUser_id(_user.getId());
        _session.setUser_type(_user.getType());
        _session.setUser_name(_user.getName());
        _session.setCustomer_id(_user.getCustomer_id());
        _session.setSuper_user(_user.getSuper_user());
        _session.setDomain_id(_user.getManagement_domain_id());
        _session.setTenant_id(_user.getTenant_id());
        _session.setApi_encryption_key(Util.getRandomKey(GlobalDataManager.getInstance().getApi_encryption_key_size()));
        SessionHelper.getInstance().add(_session);
        _login.setSession_id(_session.getId());
        _login.setCustomer_id(_user.getCustomer_id());
        if (!Util.isEmpty(_user.getType())) {
            _login.setType(_user.getType());
        }
        user _u = new user(_user.getId());
        _u.setFailed_login(0);
        _u.unSetPassword();
        UserHelper.getInstance().update(_u);
    }
}

