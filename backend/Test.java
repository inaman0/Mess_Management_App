package generated;

import platform.resource.BaseResource;
import platform.testcase.*;
null*;
import java.util.HashMap;
import java.util.Map;

public class Test {

    public static void main(String[] args) {
        TestSuite testSuite = new TestSuite("1");

        TestContext context = new TestContext();
        context.setUsername("admin@rasp.com");
        context.setPassword("admin@123");
        context.setWebserver("http://localhost:8081");
        TestManager.getInstance().execute(context, testSuite);
        TestManager.getInstance().report();
    }
}
