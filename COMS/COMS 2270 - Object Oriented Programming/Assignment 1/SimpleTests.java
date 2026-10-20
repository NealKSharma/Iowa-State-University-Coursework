import hw1.Printer;

/**
 * A few simple tests for the Printer class.
 */
public class SimpleTests {
	public static void main(String[] args) {
		// create a printer
		Printer p = new Printer(100);
		System.out.println(p.getSheetsAvailable());
		System.out.println("Expected 0");
		p.addPaper(1);
		System.out.println(p.getSheetsAvailable());
		System.out.println("Expected 1");
		System.out.println(p.getTotalPages());
		System.out.println("Expected 0");

		// start a job and print a page
		p.startPrintJob(5);
		System.out.println(p.getNextPage());
		System.out.println("Expected 0");
		p.printPage();
		System.out.println(p.getNextPage());
		System.out.println("Expected 1");
		System.out.println(p.getTotalPages());
		System.out.println("Expected 1");

		// try to print a page with no paper available
		p.printPage();
		System.out.println(p.getTotalPages());
		System.out.println("Expected 1");

		// add paper and try to print again
		p.addPaper(200);
		System.out.println(p.getSheetsAvailable());
		System.out.println("Expected 100");
		p.printPage();
		System.out.println(p.getTotalPages());
		System.out.println("Expected 2");
		System.out.println(p.getNextPage());
		System.out.println("Expected 2");

		// print the rest of the 5 page document
		p.printPage();
		p.printPage();
		p.printPage();
		System.out.println(p.getNextPage());
		System.out.println("Expected 0");
		System.out.println(p.getSheetsAvailable());
		System.out.println("Expected 96");

		// remove the paper tray, try to print, and then replace the tray
		p.removeTray();
		System.out.println(p.getSheetsAvailable());
		System.out.println("Expected 0");
		p.printPage();
		p.replaceTray();
		System.out.println(p.getSheetsAvailable());
		System.out.println("Expected 96");

		// remove paper and add paper
		p.removePaper(100);
		p.addPaper(1);
		System.out.println(p.getSheetsAvailable());
		System.out.println("Expected 1");
	}
}
