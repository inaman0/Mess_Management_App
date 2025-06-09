package com.flightBooking.FlightBookingSystem;

import org.springframework.beans.factory.annotation.Value;
import platform.testcase.DependencyManager;
import platform.testcase.TestGenerator;
import platform.testcase.TestPlanner;
import platform.testcase.YmlParser;

public class AppTestPlanner {

    String import_pack = "";
    String resource_package = "";
    String output_dir = "";

    @Value("${resource}")
    private String resource;


    // public  Map parseYml


    public static void main(String[] args) {

        AppTestPlanner a = new AppTestPlanner();
        YmlParser parser = new YmlParser();
        parser.parseYml("src/test/java/com/flightBooking/FlightBookingSystem/config.yml");
        TestPlanner testPlanner = new TestPlanner();
        String folderPath = YmlParser.RESOURCE_PATH;
        DependencyManager dependencyManager = new DependencyManager();
        dependencyManager.processFolder(folderPath, "com.flightBooking.resource");
//        testPlanner.plan(dependencyManager);

        TestGenerator tg = new TestGenerator();
        try {
            tg.generate(testPlanner.plan(dependencyManager));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}
