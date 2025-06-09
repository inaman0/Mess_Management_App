package com.flightBooking.FlightBookingSystem;

import java.util.List;
import java.util.Map;

public class MetaDataDto {

    private String resource;
    // C, R, U, or D
    private
    List<Map<String, Object>> fieldValues;

    public String getResource() {
        return resource;
    }

    public void setResource(String resource) {
        this.resource = resource;
    }

    public List<Map<String, Object>> getFieldValues() {
        return fieldValues;
    }

    public void setFieldValues(List<Map<String, Object>> fieldValues) {
        this.fieldValues = fieldValues;
    }
}
