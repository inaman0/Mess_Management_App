package generated;

import platform.resource.BaseResource;
import platform.testcase.*;
null*;
import java.util.HashMap;
import java.util.Map;

public class Plan1Test {

    public static void main(String[] args) {
        TestSuite testSuite = new TestSuite("1");

        Location Loc1= new Location();
        Loc1.setCode("DummyValue");
        Loc1.setAirport_name("DummyValue");
        testSuite.add(new TestCase("1","add-Loc1", Loc1, Location.class, "add",Loc1.convertResourceToMap()));
        Location Loc2= new Location();
        Loc2.setCode("DummyValue");
        Loc2.setAirport_name("DummyValue");
        testSuite.add(new TestCase("1","add-Loc2", Loc2, Location.class, "add",Loc2.convertResourceToMap()));
        Passport P1= new Passport();
        P1.setFull_name("DummyValue");
        P1.setNationality("DummyValue");
        P1.setPassport_number("DummyValue");
        testSuite.add(new TestCase("1","add-P1", P1, Passport.class, "add",P1.convertResourceToMap()));
        Traveler Traveler1= new Traveler();
        Traveler1.setTraveler_gender("DummyValue");
        Traveler1.setName("DummyValue");
        Traveler1.setPassport_id(null.getId());
        testSuite.add(new TestCase("1","add-Traveler1", Traveler1, Traveler.class, "add",Traveler1.convertResourceToMap()));
        Airline Arilne1= new Airline();
        Arilne1.setCode("DummyValue");
        Arilne1.setName("DummyValue");
        testSuite.add(new TestCase("1","add-Arilne1", Arilne1, Airline.class, "add",Arilne1.convertResourceToMap()));
        Flight Flight1= new Flight();
        Flight1.setFlight_number("DummyValue");
        Flight1.setDestination_location_id(null.getId());
        Flight1.setDeparture_location_id(null.getId());
        Flight1.setDeparture_date_and_time("DummyValue");
        Flight1.setAirline_id(Arilne1.getId());
        Flight1.setArrival_date_and_time("DummyValue");
        testSuite.add(new TestCase("1","add-Flight1", Flight1, Flight.class, "add",Flight1.convertResourceToMap()));
        TestContext context = new TestContext();
        context.setUsername("admin@rasp.com");
        context.setPassword("admin@123");
        context.setWebserver("http://localhost:8081");
        TestManager.getInstance().execute(context, testSuite);
        TestManager.getInstance().report();
    }
}
