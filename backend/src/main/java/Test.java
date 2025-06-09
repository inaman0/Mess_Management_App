import org.mindrot.jbcrypt.BCrypt;
import platform.defined.helper.UserHelper;
import platform.defined.resource.User;

public class Test {
    public static void main(String[] args) {
        String salt = BCrypt.gensalt(10); // 12 is a reasonable default for the cost factor

           String doubleMd5=  BCrypt.hashpw("admin@123", salt);
        User user = new User("admin@rasp.com");
        user.setType("SUPER_ADMIN");
        user.setEmail_id("admin@rasp.com");
        user.setMobile_no("123456789");
        user.setPassword(doubleMd5);
        user.setName("Super Admin");
        UserHelper.getInstance().AddOrUpdateNoCache(user);
    }
}
