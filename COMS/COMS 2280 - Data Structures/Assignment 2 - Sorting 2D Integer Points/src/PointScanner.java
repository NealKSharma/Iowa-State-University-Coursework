package edu.iastate.cs2280.hw2;

/**
 * 
 * @author Neal Kaushik Sharma
 *
 */

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.InputMismatchException;
import java.util.Scanner;
import java.io.File;


/**
 * 
 * This class sorts all the points in an array of 2D points to determine a reference point whose x and y 
 * coordinates are respectively the medians of the x and y coordinates of the original points. 
 * 
 * It records the employed sorting algorithm as well as the sorting time for comparison. 
 *
 */
public class PointScanner  
{
	private Point[] points; 
	
	private Point medianCoordinatePoint;  // point whose x and y coordinates are respectively the medians of 
	                                      // the x coordinates and y coordinates of those points in the array points[].
	private Algorithm sortingAlgorithm;    
	
		
	protected long scanTime; 	       // execution time in nanoseconds. 
	
	/**
	 * This constructor accepts an array of points and one of the four sorting algorithms as input. Copy 
	 * the points into the array points[].
	 * 
	 * @param  pts  input array of points 
	 * @throws IllegalArgumentException if pts == null or pts.length == 0.
	 */
	public PointScanner(Point[] pts, Algorithm algo) throws IllegalArgumentException
	{
		if (pts == null || pts.length == 0) {
            throw new IllegalArgumentException("Point array cannot be null or empty");
        }
		points = new Point[pts.length];
		for (int i = 0; i < pts.length; i++) {
			Point p = new Point(pts[i]);
			points[i] = p;
		}
        this.sortingAlgorithm = algo;
	}

	
	/**
	 * This constructor reads points from a file. 
	 * 
	 * @param  inputFileName
	 * @throws FileNotFoundException 
	 * @throws InputMismatchException   if the input file contains an odd number of integers
	 */
	protected PointScanner(String inputFileName, Algorithm algo) throws FileNotFoundException, InputMismatchException
	{
		this.sortingAlgorithm = algo;
        
        Scanner scanner = new Scanner(new File(inputFileName));
        int count = 0;
        while (scanner.hasNextInt()) {
            scanner.nextInt();
            count++;
        }
         
        if (count == 0) {
        	scanner.close();
            throw new InputMismatchException("Input file is empty");
        }
        
        if (count % 2 != 0) {
            scanner.close();
            throw new InputMismatchException("Input file contains an odd number of integers");
        }
        
        points = new Point[count / 2];
        scanner.close();
        
        scanner = new Scanner(new File(inputFileName));
        
        for (int i = 0; i < points.length; i++) {
            int x = scanner.nextInt();
            int y = scanner.nextInt();
            points[i] = new Point(x, y);
        }
        scanner.close();
	}

	
	/**
	 * Carry out two rounds of sorting using the algorithm designated by sortingAlgorithm as follows:  
	 *    
	 *     a) Sort points[] by the x-coordinate to get the median x-coordinate. 
	 *     b) Sort points[] again by the y-coordinate to get the median y-coordinate.
	 *     c) Construct medianCoordinatePoint using the obtained median x- and y-coordinates.     
	 *  
	 * Based on the value of sortingAlgorithm, create an object of SelectionSorter, InsertionSorter, MergeSorter,
	 * or QuickSorter to carry out sorting.       
	 * @param algo
	 * @return
	 */
	public void scan()
	{		
		// create an object to be referenced by aSorter according to sortingAlgorithm. for each of the two 
		// rounds of sorting, have aSorter do the following: 
		// 
		//     a) call setComparator() with an argument 0 or 1. 
		//
		//     b) call sort(). 		
		// 
		//     c) use a new Point object to store the coordinates of the medianCoordinatePoint
		//
		//     d) set the medianCoordinatePoint reference to the object with the correct coordinates.
		//
		//     e) sum up the times spent on the two sorting rounds and set the instance variable scanTime. 
		
		AbstractSorter aSorter;
		
		// Create the appropriate sorter based on the algorithm
        switch (sortingAlgorithm) {
            case SelectionSort:
                aSorter = new SelectionSorter(points);
                break;
            case InsertionSort:
                aSorter = new InsertionSorter(points);
                break;
            case MergeSort:
                aSorter = new MergeSorter(points);
                break;
            case QuickSort:
                aSorter = new QuickSorter(points);
                break;
            default:
                throw new IllegalArgumentException("Invalid algorithm");
        }
		
		long startTime, endTime;
        scanTime = 0;
        
        // Sort by x-coordinate
        aSorter.setComparator(0);
        startTime = System.nanoTime();
        aSorter.sort();
        endTime = System.nanoTime();
        scanTime += (endTime - startTime);
        int medianX = aSorter.getMedian().getX();
        
        // Sort by y-coordinate
        aSorter.setComparator(1);
        startTime = System.nanoTime();
        aSorter.sort();
        endTime = System.nanoTime();
        scanTime += (endTime - startTime);
        int medianY = aSorter.getMedian().getY();
        
        medianCoordinatePoint = new Point(medianX, medianY);
	}
	
	
	/**
	 * Outputs performance statistics in the format: 
	 * 
	 * <sorting algorithm> <size>  <time>
	 * 
	 * For instance, 
	 * 
	 * selection sort   1000	  9200867
	 * 
	 * Use the spacing in the sample run in Section 2 of the project description. 
	 */
	public String stats()
	{
		return String.format("%-12s %7d %12d", 
                sortingAlgorithm.toString(), 
                points.length, 
                scanTime);
	}
	
	
	/**
	 * Write MCP after a call to scan(),  in the format "MCP: (x, y)"   The x and y coordinates of the point are displayed on the same line with exactly one blank space 
	 * in between. 
	 */
	@Override
	public String toString()
	{
		return "MCP: (" + medianCoordinatePoint.getX() + ", " + medianCoordinatePoint.getY() + ")";
	}

	
	/**
	 *  
	 * This method, called after scanning, writes point data into a file by outputFileName. The format 
	 * of data in the file is the same as printed out from toString().  The file can help you verify 
	 * the full correctness of a sorting result and debug the underlying algorithm. 
	 * 
	 * @throws FileNotFoundException
	 */
	public void writeMCPToFile() throws FileNotFoundException
	{
		PrintWriter out = new PrintWriter("output.txt");
        out.println(this.toString());
        out.close();
	}	

	

		
}
