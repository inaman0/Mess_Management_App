package com.flightBooking.FlightBookingSystem;

import platform.testcase.ResOp;

import java.util.ArrayList;
import java.util.List;

public class MetaDataPlan {

    List<MetaDataDto> dto = new ArrayList<>();


    public List<MetaDataDto> getMetaDataDto()
    {
        return dto;
    }
    public void addResOp(MetaDataDto resOp)
    {
        dto.add(resOp);
    }
}
