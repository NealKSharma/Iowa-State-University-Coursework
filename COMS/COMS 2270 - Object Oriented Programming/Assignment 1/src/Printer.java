package hw1;
 /**	
  * Printer class
  * 
  * The printer can start Print jobs, manage tray, and print pages.
  * 
  * @author Neal Kaushik Sharma
  */
public class Printer {
 
    private int trayCap;
    private int paperAvailable;
    private int pagesPrinted;
    private int pagesToPrint;
    private int nextPage;
    private int pagesDocument;
    private int paperInTray;
    
    /**
     * Constructs a Printer with the provided tray capacity.
     * 
     * @param trayCapacity capacity of the paper tray in sheets.
     */
    public Printer(int trayCapacity) {
        trayCap = trayCapacity;
        paperAvailable = 0;
        pagesPrinted = 0;
        pagesToPrint = 0;
        nextPage = 0;
        pagesDocument = 0;
        paperInTray = 0;
    }
    
    /**
     * Starts a new print job with the provide number of pages.
     * 
     * @param documentPages Total number of pages in the document.
     */
    public void startPrintJob(int documentPages) {
        pagesDocument = documentPages;
        nextPage = 0;
    }
    
    /**
     * Returns the number of sheets which are available.
     * 
     * @return the number of sheets available.
     */
    public int getSheetsAvailable() {
        return paperAvailable;
    }
    
    /**
     * Returns the number of the next page to be printed in the current print job.
     * 
     * @return the page number of the next page.
     */
    public int getNextPage() {
        return nextPage;
    }
    
    /**
     * returns the total number of pages printed.
     * 
     * @return the total number of pages printed.
     */
    public int getTotalPages() {
        return pagesPrinted;
    }
    
    /**
     * Prints a page if there is paper available and the document has pages to print.
     * Decrements and decrements the values of pages available, next page and pages printed.
     * Once the document is printed, the value of next page is reset back to 0.
     */
    public void printPage() {
        pagesToPrint = Math.max(0, Math.min(1, paperAvailable));
        paperAvailable -= pagesToPrint;
        paperInTray -= pagesToPrint;
        pagesPrinted += pagesToPrint;
        nextPage += pagesToPrint;
        nextPage %= pagesDocument;
    }
    
    /**
     * Removes the paper in the tray and stores it in a temporary storage.
     */
    public void removeTray() {
    	paperAvailable = 0;
    }
    
    /**
     * Replaces the paper in tray with the ones stored in temporary storage, without going over the tray capacity.
     */
    public void replaceTray() {
    	paperAvailable = paperInTray;
    }
    
    /**
     * Adds the number of provided sheets to the paper available to the printer.
     *
     * @param sheets the number of sheets to add
     */
    public void addPaper(int sheets) {
    	removeTray();
        paperInTray = Math.min(trayCap, paperInTray + sheets);
        replaceTray();
    }
    
    /**
     * Removes the number of sheets specified from the paper available to the printer.
     *
     * @param sheets the number of sheets to remove
     */
    public void removePaper(int sheets) {
    	removeTray();
        paperInTray = Math.max(0, paperInTray - sheets);
        replaceTray();
    }
}