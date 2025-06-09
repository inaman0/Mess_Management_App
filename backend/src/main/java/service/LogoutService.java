package service;

import platform.helper.SessionHelper;
import platform.resource.BaseResource;
import platform.resource.logout;
import platform.util.ApplicationException;
import platform.webservice.BaseService;
import platform.webservice.ServletContext;

public class LogoutService extends BaseService {
    public LogoutService() {
        super(new logout());
    }

    public void add(ServletContext ctx, BaseResource src) throws ApplicationException {
        if (ctx != null) {
            SessionHelper.getInstance().deleteById(ctx.getSessionId());
        }
    }
}
