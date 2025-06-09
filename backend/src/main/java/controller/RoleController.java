package controller;
import com.flightBooking.resource.Role;
import java.util.ArrayList;
import org.springframework.web.bind.annotation.GetMapping;
import java.lang.reflect.Field;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
 import org.springframework.web.bind.annotation.CrossOrigin;

@RestController("roleControllerV1") // <— Unique bean name
@CrossOrigin(origins = "*")
public class RoleController {
    @GetMapping("/api/Role")
    public List<Object> getEnums() throws IllegalAccessException {
        Field[] fields = Role.class.getFields();
        List<Object> names = new ArrayList<>();
        for (Field f : fields) {
            if (f.getName().startsWith("ID")) continue;
            Object value = f.get(null);
            names.add(value);
        }
        return names;
    }
}
