package com.flightBooking.FlightBookingSystem;

import platform.testcase.*;

public class AppTestPlanner_config {

    public static void main(String[] args)
    {
        TestPlanner_config testPlanner = new TestPlanner_config();
        TestConfig testConfig = new TestConfig();
        YmlParser parser=new YmlParser();
        parser.parseYml("src/test/java/com/flightBooking/FlightBookingSystem/config.yml");
        testConfig.parseYamlFile(YmlParser.TEST_CONFIG);
        TestGenerator tg = new TestGenerator();
        try {
            tg.generate(testPlanner.plan(testConfig));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
