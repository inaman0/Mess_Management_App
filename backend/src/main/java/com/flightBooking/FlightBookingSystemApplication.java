package com.flightBooking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import platform.defined.account.helper.RoleHelper;
import platform.helper.HelperManager;

@SpringBootApplication
@ComponentScan(basePackages = {"controller", "platform.webservice.map", "platform.webservice.controller.base","ci",".src/main/java/com/flightBooking","platform.defined.account.controller"})

public class FlightBookingSystemApplication {

    public static void main(String[] args) {
        Registry.register();

        HelperManager.getInstance().register(RoleHelper.getInstance());
        SpringApplication.run(FlightBookingSystemApplication.class, args);

    }

}
