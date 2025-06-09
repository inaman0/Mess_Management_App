package ci;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MenuRunner implements CommandLineRunner {

    @Autowired
    private CommandLineMenu myMenu;

    @Override
    public void run(String... args) {
        Thread menuThread = new Thread(myMenu);
        menuThread.start();
    }
}
