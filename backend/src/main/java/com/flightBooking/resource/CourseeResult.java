/*
 * Copyright 2010-2020 M16, Inc. All rights reserved.
 * This software and documentation contain valuable trade
 * secrets and proprietary property belonging to M16, Inc.
 * None of this software and documentation may be copied,
 * duplicated or disclosed without the express
 * written permission of M16, Inc.
 */

package com.flightBooking.resource;

import platform.defined.resource.Baseresult;
import platform.util.Util;

/*
 ********** This is a generated class Don't modify it.Extend this file for additional functionality **********
 * 
 */
 public class CourseeResult extends Baseresult {
	Coursee[] resource;

	public Coursee[] getResource() {
		return resource;
	}

	public void setResource(Coursee[] resource) {
		this.resource = resource;
	}

	public Coursee getSingleResource() {
		if (Util.isEmpty(resource))
			return null;
		return (Coursee)resource[0];
	}
}