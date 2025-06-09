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
public class MealType extends BasePossibleValue {
		public static String ID_Breakfast = "Breakfast";
		public static String NAME_Breakfast = "Breakfast";
		public static String ID_Lunch = "Lunch";
		public static String NAME_Lunch = "Lunch";
		public static String ID_Snacks = "Snacks";
		public static String NAME_Snacks = "Snacks";
		public static String ID_Dinner = "Dinner";
		public static String NAME_Dinner = "Dinner";
		public MealType() {super("MEAL_TYPE");}
		protected void populate() {
 			add(new Enum(ID_Breakfast,NAME_Breakfast));
 			add(new Enum(ID_Lunch,NAME_Lunch));
 			add(new Enum(ID_Snacks,NAME_Snacks));
 			add(new Enum(ID_Dinner,NAME_Dinner));
		}
}