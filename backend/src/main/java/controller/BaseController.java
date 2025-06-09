package controller;



import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import platform.db.Expression;
import platform.db.REL_OP;
import platform.defined.account.helper.RoleResourceHelper;
import platform.defined.account.resource.RoleResource;
import platform.defined.resource.AuditLog;
import platform.defined.resource.User;
import platform.defined.service.AuditLogService;
import platform.helper.SessionHelper;
import platform.helper.UserHelper;
import platform.resource.BaseResource;
import platform.resource.login;
import platform.resource.result;
import platform.resource.session;
import platform.util.*;
import platform.util.security.SecurityUtil;
import platform.webservice.BaseService;
import platform.webservice.ServletContext;

//import javax.servlet.http.HttpServletRequest;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;
public class BaseController {
    BaseService service;
    BaseResource resource;

    @Value("${rbac.enabled}")
    private boolean rbac_enabled;

    private static final String[] HEADERS_TO_TRY = {"X-Forwarded-For",
            "Proxy-Client-IP", "WL-Proxy-Client-IP", "HTTP_X_FORWARDED_FOR",
            "HTTP_X_FORWARDED", "HTTP_X_CLUSTER_CLIENT_IP", "HTTP_CLIENT_IP",
            "HTTP_FORWARDED_FOR", "HTTP_FORWARDED", "HTTP_VIA", "REMOTE_ADDR"};
    public BaseController(BaseResource resource, BaseService service) {
        this.service = service;
        this.resource = resource;
    }



    protected boolean isLoginRequired() {
        return true;
    }
    ServletContext validSession(String sessionId) throws ApplicationException {
        if (!isLoginRequired()) {
            return null;
        }
        session _session = (session) SessionHelper.getInstance().getById(sessionId);
        if (_session == null) {
            if (!isLoginRequired()) {
                return null;
            }
            throw new ApplicationException(ExceptionSeverity.ERROR, "Invalid Session");
        }
        ServletContext ctx = new ServletContext(_session);
        return ctx;
    }
    @CrossOrigin(origins = "*")
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    String Get(@CookieValue(value="session_id",required=false) String sessionId,
               @RequestParam(value="queryId", required=true) String queryId,
               @RequestParam(value="session_id", required=false) String session_id,
               @RequestParam(value = "page_no", required = false) String page_no,
               @RequestParam(value = "order_by", required = false) String order_by,
               @RequestParam(value = "page_size", required = false) String page_size,
               @RequestParam(value = "search_fields", required = false) String search_fields,
               @RequestParam(value = "filter", required = false) String filter,
               @RequestParam(value = "search", required = false) String search,
               @RequestParam(value="args", required=false) String args) {
        result result = new result();
        try {
            if (Util.isEmpty(sessionId)) {
                sessionId = session_id;
            }
            if ("undefined".equalsIgnoreCase(sessionId)) {
                sessionId = null;
            }
            ServletContext ctx = validSession(sessionId);
            validateRole(ctx,queryId);//verify access
            if (!Util.isEmpty(page_no)) {
                ctx.addParam("page_no", page_no);
            }
            if (!Util.isEmpty(page_size)) {
                ctx.addParam("page_size", page_size);
            }
            if (!Util.isEmpty(order_by)) {
                ctx.addParam("order_by", order_by);
            }
            if (!Util.isEmpty(filter)) {
                ctx.addParam("filter", filter);
            }
            if (!Util.isEmpty(search)) {
                ctx.addParam("search", search);
            }
            if (!Util.isEmpty(search_fields)) {
                ctx.addParam("search_fields", search_fields);
            }
            Map<String,Object> map = new HashMap();
            if (!Util.isEmpty(args)) {
                String[] argvalues = args.split(",");
                for(String values: argvalues) {
                    String[] valpair = values.split(":");
                    if (valpair.length != 2) {
                        throw new ApplicationException(ExceptionSeverity.ERROR, "args can  have only values of format name:value");
                    }
                    if(valpair[1] != null && valpair[1].indexOf(";") != -1)
                        map.put(valpair[0], valpair[1].split(";"));
                    else
                        map.put(valpair[0], valpair[1]);
                }
            }
            BaseResource[] resources = service.getQuery(ctx,queryId,map);
//            if (isLoginRequired()) {
//                if (!Util.isEmpty(resources)) {
//                    if (isFieldEncryptionRequired(resources[0])) {
//                        for (BaseResource resource : resources) {
//                            encrypt_resource_field(ctx, resource);
//                        }
//                    }
//                }
//            }
            result.setErrCode(0);
            result.setMessage("Success");
            result.setResource(resources);
        } catch (Exception e) {
            e.printStackTrace();
            result.setErrCode(-1);
            result.setMessage(e.getMessage());

        }
        String responseStr = Json.resulttoString(result);
        return responseStr;
    }

    public boolean isFieldEncryptionRequired(BaseResource resource) {
        for(Field field : resource.getMetaData().getFieldsArray()) {
            if (field.isApi_encrypt())
                return true;
        }
        return false;
    }

    void encrypt_resource_field(ServletContext ctx, BaseResource resource) {
        Map<String,Object> map = resource.convertResourceToMap();
        for(Field field : resource.getMetaData().getFieldsArray()) {
            if (field.isApi_encrypt()) {
                String value = map.get(field.getName()).toString();
                if (value == null)
                    continue;
                try {
                    value = SecurityUtil.aesEncrypt(value, ctx.getSession().getApi_encryption_key());
                }catch (Exception e) {
                    e.printStackTrace();
                }
                map.put(field.getName(),value);
            }
        }
        resource.convertMapToResource(map);
    }

    private AuditLog populateAuditLogCommonFields(String decodeString,
                                                  BaseResource _resource, String action, String ipAddress) {
        AuditLog audit_log = new AuditLog();
        audit_log.setResource_action(action.toUpperCase());
        audit_log.setResource_data(decodeString);
        audit_log.setResource_id(_resource.getId());
        audit_log.setResource_type(_resource.getResourceType());
        audit_log.setResource_name(_resource.getName());
        audit_log.setClient_ip_address(ipAddress);
        return audit_log;
    }

    private String addToAuditLogs(ServletContext ctx, String decodeString,
                                  BaseResource _resource, String action, String ipAddress)
            throws ApplicationException {
        AuditLogService auditLogService = new AuditLogService();
        AuditLog audit_log = populateAuditLogCommonFields(decodeString,
                _resource, action, ipAddress);
        if (_resource instanceof login) {
            login _login = (login) _resource;
            audit_log.setUser_id(_login.getEmail_id());
        }
        audit_log.setUser_id(ctx.getUserId());
        audit_log.setUser_name(ctx.getUserName());
        audit_log.setTenant_id(ctx.getTenantId());
        audit_log.setDomain_id(ctx.getDomainId());
        audit_log.setAccount_id(ctx.getAccountId());
        auditLogService.add(ctx, audit_log);
        return audit_log.getId();
    }

    private String getClientIpAddress(HttpServletRequest request) {
        for (String header : HEADERS_TO_TRY) {
            String ipAddress = request.getHeader(header);
            if (ipAddress != null && ipAddress.length() != 0
                    && !"unknown".equalsIgnoreCase(ipAddress)) {
                return ipAddress.contains(",") ? ipAddress.split(",")[0]
                        : ipAddress;
            }
        }
        return request.getRemoteAddr();
    }


    protected String getAuditLogString(BaseResource resource) {
        return Json.objecttoString(resource);
    }

    protected void pre_process(ServletContext ctx,BaseResource resource) {
        if (Util.isEmpty(resource.getName())) {
            if (service.getHelper()  != null) {
                BaseResource _resource = service.getHelper().getById(resource.getId());
                if (_resource != null)
                    resource.setName(_resource.getName());
            }
        }
    }

    void validateRole(ServletContext ctx, String action) throws ApplicationException {
        if (rbac_enabled) {
            String userId = ctx.getUserId();//geting user id from ServletContext
            User user = (User) UserHelper.getInstance().getById(userId);//getting user by id
            if (user == null) {
                throw new ApplicationException(ExceptionSeverity.ERROR, "Invalid Session ID");
            }
            if (user.getRole() == null) {
                throw new ApplicationException(ExceptionSeverity.ERROR, "Role id not found!!");
            }
            String resource = service.getResource().getMetaData().getName();//getting resource name
            RoleResource roleResource = (RoleResource) RoleResourceHelper.getInstance().getByExpressionFirstRecord(Expression.and
                    (new Expression(RoleResource.FIELD_ROLE_ID, REL_OP.EQ, user.getRole()),
                            new Expression(RoleResource.FIELD_ACTION, REL_OP.EQ, action), new Expression(RoleResource.FIELD_RESOURCE, REL_OP.EQ, resource)));//checking the access
            if (roleResource == null) {
                throw new ApplicationException(ExceptionSeverity.ERROR, "Access denied!!!");
            }
        }
    }

    @CrossOrigin(origins = "*")
    @RequestMapping(method = RequestMethod.POST)
    public @ResponseBody
    String post(@CookieValue(value="session_id",required=false) String sessionId,
                @RequestParam(value="resource", required=true) String _resourceString,
                @RequestParam(value="session_id", required=false) String session_id,
                @RequestParam(value="action", required=false) String action,
                @RequestParam(value="security_code", required=false) String security_code,
                HttpServletRequest request) {
        result result = new result();
        String audit_log_id = null;
        ServletContext ctx = null;
        try {
            if (Util.isEmpty(sessionId)) {
                sessionId = session_id;
            }
            ctx = validSession(sessionId);
            validateRole(ctx,action);
            String decodeString = SecurityUtil.decodeBase64(_resourceString);
            System.out.println(decodeString);
            BaseResource _resource = Json.stringToResource(URLDecoder.decode(decodeString),resource.getClass());
            pre_process(ctx,_resource);
            if (action == null) {
                action = "add";
            }
            if (ctx != null)
                ctx.setSecurity_code(security_code);
            String ipAddress = getClientIpAddress(request);
            if ("add".equalsIgnoreCase(action)) {
                service.add(ctx, _resource);
            } else {
                service.action(ctx,_resource,action);
            }
            pre_process(ctx,_resource);
            if (isLoginRequired()) {
                audit_log_id = addToAuditLogs(ctx,
                        getAuditLogString(_resource), _resource, action,
                        ipAddress);
            }
            if (!Util.isEmpty(audit_log_id)) {
                updateAuditLogs(ctx, audit_log_id, "0", "Success");
            }
            result.setErrCode(0);
            result.setMessage("Success");
            result.setResource(_resource);
        } catch (Exception e) {
            if (!Util.isEmpty(audit_log_id)) {
                updateAuditLogs(ctx, audit_log_id, "-1", e.getMessage());
            }
            e.printStackTrace();
            result.setErrCode(-1);
            result.setMessage(e.getMessage());
        }
        String responseStr = Json.resulttoString(result);
        return responseStr;
    }

    private void updateAuditLogs(ServletContext ctx, String id,
                                 String errorCode, String errorMessage) {
        try {
            AuditLogService auditLogService = new AuditLogService();
            AuditLog audit_log = (AuditLog) auditLogService.get(ctx, id);
            if (null != audit_log) {
                audit_log.setError_code(errorCode);
                audit_log.setError_message(errorMessage);
                if (Util.isEmpty(audit_log.getTenant_id()) && null != ctx) {
                    audit_log.setTenant_id(ctx.getTenantId());
                }
                if (Util.isEmpty(audit_log.getCustomer_id()) && null != ctx) {
                    audit_log.setCustomer_id(ctx.getCustomerId());
                }
                if (Util.isEmpty(audit_log.getCustomer_name()) && null != ctx) {
                    audit_log.setCustomer_name(ctx.getCustomerName());
                }
                if (Util.isEmpty(audit_log.getDomain_id()) && null != ctx) {
                    audit_log.setDomain_id(ctx.getDomainId());
                }
                if (Util.isEmpty(audit_log.getAccount_id()) && null != ctx) {
                    audit_log.setAccount_id(ctx.getAccountId());
                }
                if (Util.isEmpty(audit_log.getFacility_id()) && null != ctx) {
                    audit_log.setFacility_id(ctx.getFacilityId());
                }
                if (Util.isEmpty(audit_log.getUser_name()) && null != ctx) {
                    audit_log.setUser_name(ctx.getUserName());
                }
                auditLogService.update(ctx, audit_log);
            }
        } catch (Exception excep) {
            excep.printStackTrace();
        }
    }

}

