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
		public static String ID_Normal = "Normal";
		public static String NAME_Normal = "Normal";
		public static String ID_Dessert = "Dessert";
		public static String NAME_Dessert = "Dessert";
		public static String ID_Curd = "Curd";
		public static String NAME_Curd = "Curd";
		public DishType() {super("DISH_TYPE");}
		protected void populate() {
 			add(new Enum(ID_Normal,NAME_Normal));
 			add(new Enum(ID_Dessert,NAME_Dessert));
 			add(new Enum(ID_Curd,NAME_Curd));
		}
}