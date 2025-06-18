package com.flightBooking;
import platform.helper.HelperManager;
import platform.webservice.ServiceManager;
import com.flightBooking.helper.*;
import com.flightBooking.service.*;
public class Registry {
		public static void register(){
				 HelperManager.getInstance().register(CourseeHelper.getInstance());
				 HelperManager.getInstance().register(DishHelper.getInstance());
				 HelperManager.getInstance().register(FeedbackHelper.getInstance());
				 HelperManager.getInstance().register(MealHelper.getInstance());
				 HelperManager.getInstance().register(MenuHelper.getInstance());
				 HelperManager.getInstance().register(MenuItemHelper.getInstance());
				 HelperManager.getInstance().register(ReviewHelper.getInstance());
				 HelperManager.getInstance().register(SickMealHelper.getInstance());
				 HelperManager.getInstance().register(UserHelper.getInstance());
				 ServiceManager.getInstance().register(new CourseeService());
				 ServiceManager.getInstance().register(new DishService());
				 ServiceManager.getInstance().register(new FeedbackService());
				 ServiceManager.getInstance().register(new MealService());
				 ServiceManager.getInstance().register(new MenuService());
				 ServiceManager.getInstance().register(new MenuItemService());
				 ServiceManager.getInstance().register(new ReviewService());
				 ServiceManager.getInstance().register(new SickMealService());
				 ServiceManager.getInstance().register(new UserService());
		}
}
