package ci;

import org.springframework.stereotype.Component;
import platform.defined.helper.UserHelper;
import platform.defined.resource.User;

import java.util.Scanner;

@Component
public class CommandLineMenu implements Runnable {
    private boolean exit = false;

    private void displayMenu() {
        System.out.println("Welcome to the Command-Line!");
        Scanner scanner = new Scanner(System.in);
User user=new User("admin@rasp.com");


        user.setType("SUPER_ADMIN");

        System.out.print("Enter your userEmail: ");
        String email = scanner.nextLine();
        user.setEmail_id(email);

        System.out.print("Enter your Mobile NUmber: ");
        String number = scanner.nextLine();
        user.setMobile_no(number);

        System.out.print("Enter your password: ");
        String password = scanner.nextLine();
        user.setPassword(password);

        System.out.print("Enter your username: ");
        String userName = scanner.nextLine();
        user.setName(userName);

        UserHelper.getInstance().AddOrUpdateNoCache(user);




    }

    @Override
    public void run() {
        Scanner scanner = new Scanner(System.in);
        while (!exit) {
            displayMenu();

        }
        scanner.close();
    }


}
