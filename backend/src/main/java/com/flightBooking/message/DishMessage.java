/*
 * Copyright 2010-2020 M16, Inc. All rights reserved.
 * This software and documentation contain valuable trade
 * secrets and proprietary property belonging to M16, Inc.
 * None of this software and documentation may be copied,
 * duplicated or disclosed without the express
 * written permission of M16, Inc.
 */

package com.flightBooking.message;

import com.flightBooking.resource.*;
import platform.communication.kafka.BaseMessage;
import platform.resource.BaseResource;
import platform.webservice.BaseService;
import platform.db.*;
import java.util.*;

/*
 ********** This is a generated class Don't modify it.Extend this file for additional functionality **********
 * 
 */
 public class DishMessage extends BaseMessage {
		public DishMessage() {this(new Dish());}
		public DishMessage(BaseResource resource) {super(resource);}
		public DishMessage(BaseResource resource,String action) {super(resource,action);}
		public DishMessage(BaseResource resource,String action,String sessionId) {super(resource,action,sessionId);}
		public static DishMessage of(BaseResource resource,String action) {return new DishMessage(resource,action);}
}