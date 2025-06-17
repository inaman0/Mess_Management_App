/*
 * Copyright 2010-2020 M16, Inc. All rights reserved.
 * This software and documentation contain valuable trade
 * secrets and proprietary property belonging to M16, Inc.
 * None of this software and documentation may be copied,
 * duplicated or disclosed without the express
 * written permission of M16, Inc.
 */

package com.flightBooking.resource;

import platform.webservice.BasePossibleValue;
import platform.webservice.Enum;

/*
 ********** This is a generated class Don't modify it.Extend this file for additional functionality **********
 * 
 */
public class DishType extends BasePossibleValue {
		public static String ID_Chicken = "Chicken";
		public static String NAME_Chicken = "Chicken";
		public static String ID_Egg = "Egg";
		public static String NAME_Egg = "Egg";
		public static String ID_Veg = "Veg";
		public static String NAME_Veg = "Veg";
		public DishType() {super("DISH_TYPE");}
		protected void populate() {
 			add(new Enum(ID_Chicken,NAME_Chicken));
 			add(new Enum(ID_Egg,NAME_Egg));
 			add(new Enum(ID_Veg,NAME_Veg));
		}
}