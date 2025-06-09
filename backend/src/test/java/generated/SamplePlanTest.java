package generated;

import platform.resource.BaseResource;
import platform.testcase.*;
import com.flightBooking.resource.*;
import com.flightBooking.helper.*;
import java.util.HashMap;
import java.util.Map;

public class SamplePlanTest {

    public static void main(String[] args) {
        TestSuite testSuite = new TestSuite("1");

        Passport passport1= new Passport();
        passport1.setFull_name("full_name_3fc20");
        passport1.setNationality("nationality_2f6b2");
        passport1.setPassport_number("passport_number_4d037");
        testSuite.add(new TestCase("1","add-passport1", passport1, Passport.class, "add",passport1.convertResourceToMap()));
        Airline airline1= new Airline();
        airline1.setCode("code_92f72");
        airline1.setName("name_cb64f");
        testSuite.add(new TestCase("1","add-airline1", airline1, Airline.class, "add",airline1.convertResourceToMap()));
        Location location1= new Location();
        location1.setCode("code_9dd55");
        location1.setAirport_name("airport_name_23e87");
        testSuite.add(new TestCase("1","add-location1", location1, Location.class, "add",location1.convertResourceToMap()));
        Flight flight1= new Flight();
        flight1.setFlight_number("flight_number_c8d85");
        flight1.setDestination_location_id(location1.getId());
        flight1.setDeparture_location_id(location1.getId());
        flight1.setDeparture_date_and_time("departure_date_and_time_bbbf3");
        flight1.setAirline_id(airline1.getId());
        flight1.setArrival_date_and_time("arrival_date_and_time_1e9b8");
        testSuite.add(new TestCase("1","add-flight1", flight1, Flight.class, "add",flight1.convertResourceToMap()));
        Traveler traveler1= new Traveler();
        traveler1.setTraveler_gender("traveler_gender_6f577");
        traveler1.setName("name_c798b");
        traveler1.setPassport_id(passport1.getId());
        testSuite.add(new TestCase("1","add-traveler1", traveler1, Traveler.class, "add",traveler1.convertResourceToMap()));
        Bookings bookings1= new Bookings();
        bookings1.setTraveler_id(traveler1.getId());
        bookings1.setTravel_date("travel_date_0ffb8");
        bookings1.setFlight_id(flight1.getId());
        testSuite.add(new TestCase("1","add-bookings1", bookings1, Bookings.class, "add",bookings1.convertResourceToMap()));
        Document document1= new Document();
        document1.setBooking_id(bookings1.getId());
        document1.setTraveler_id(traveler1.getId());
        document1.setPassport_id(passport1.getId());
        testSuite.add(new TestCase("1","add-document1", document1, Document.class, "add",document1.convertResourceToMap()));
        TestContext context = new TestContext();
        context.setUsername("admin@rasp.com");
        context.setPassword("admin@123");
        context.setWebserver("http://localhost:8081");
        TestManager.getInstance().execute(context, testSuite);
        TestManager.getInstance().report();
TestSuite testSuite2 = new TestSuite("1");
        Passport passport12= (Passport) PassportHelper.getInstance().getById(passport1.getId());
        passport12.setFull_name("full_name_f5fa76");
        passport12.setNationality("nationality_400f7e");
        passport12.setPassport_number("passport_number_f3a450");
        testSuite2.add(new TestCase("2","update-passport12", passport12, Passport.class, "MODIFY",passport12.convertResourceToMap()));
        Airline airline12= (Airline) AirlineHelper.getInstance().getById(airline1.getId());
        airline12.setCode("code_09aa2b");
        airline12.setName("name_692cd3");
        testSuite2.add(new TestCase("2","update-airline12", airline12, Airline.class, "MODIFY",airline12.convertResourceToMap()));
        Location location12= (Location) LocationHelper.getInstance().getById(location1.getId());
        location12.setCode("code_a23d3a");
        location12.setAirport_name("airport_name_092b54");
        testSuite2.add(new TestCase("2","update-location12", location12, Location.class, "MODIFY",location12.convertResourceToMap()));
        Flight flight12= (Flight) FlightHelper.getInstance().getById(flight1.getId());
        flight12.setFlight_number("flight_number_28e608");
        flight12.setDeparture_date_and_time("departure_date_and_time_e7a479");
        flight12.setArrival_date_and_time("arrival_date_and_time_17058d");
        testSuite2.add(new TestCase("2","update-flight12", flight12, Flight.class, "MODIFY",flight12.convertResourceToMap()));
        Traveler traveler12= (Traveler) TravelerHelper.getInstance().getById(traveler1.getId());
        traveler12.setTraveler_gender("traveler_gender_4725bf");
        traveler12.setName("name_bb1f5e");
        testSuite2.add(new TestCase("2","update-traveler12", traveler12, Traveler.class, "MODIFY",traveler12.convertResourceToMap()));
        Bookings bookings12= (Bookings) BookingsHelper.getInstance().getById(bookings1.getId());
        bookings12.setTravel_date("travel_date_1687be");
        testSuite2.add(new TestCase("2","update-bookings12", bookings12, Bookings.class, "MODIFY",bookings12.convertResourceToMap()));
        Document document12= (Document) DocumentHelper.getInstance().getById(document1.getId());
        testSuite2.add(new TestCase("2","update-document12", document12, Document.class, "MODIFY",document12.convertResourceToMap()));
        TestManager.getInstance().execute(context, testSuite2);
        TestManager.getInstance().report();
    }
}
