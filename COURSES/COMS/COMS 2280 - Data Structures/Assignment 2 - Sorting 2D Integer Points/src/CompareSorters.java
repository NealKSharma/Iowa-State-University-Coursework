package edu.iastate.cs2280.hw2;

/**
 *  
 * @author Neal Kaushik Sharma
 *
 */

/**
 * 
 * This class executes four sorting algorithms: selection sort, insertion sort, mergesort, and
 * quicksort, over randomly generated integers as well integers from a file input. It compares the 
 * execution times of these algorithms on the same input. 
 *
 */
import java.util.InputMismatchException;
import java.io.FileNotFoundException;
import java.util.Scanner; 
import java.util.Random;


public class CompareSorters 
{
	/**
	 * Repeatedly take integer sequences either randomly generated or read from files. 
	 * Use them as coordinates to construct points.  Scan these points with respect to their 
	 * median coordinate point four times, each time using a different sorting algorithm.  
	 * 
	 * @param args
	 **/
	public static void main(String[] args) throws FileNotFoundException
	{		
		// Conducts multiple rounds of comparison of four sorting algorithms.  Within each round, 
		// set up scanning as follows: 
		// 
		//    a) If asked to scan random points, calls generateRandomPoints() to initialize an array 
		//       of random points. 
		// 
		//    b) Reassigns to the array scanners[] (declared below) the references to four new 
		//       PointScanner objects, which are created using four different values  
		//       of the Algorithm type:  SelectionSort, InsertionSort, MergeSort and QuickSort. 
		// 
		// 			
		// For each input of points, do the following. 
		// 
		//     a) Initialize the array scanners[].  
		//
		//     b) Iterate through the array scanners[], and have every scanner call the scan() 
		//        method in the PointScanner class.  
		//
		//     c) After all four scans are done for the input, print out the statistics table from
		//		  section 2.
		//
		// A sample scenario is given in Section 2 of the project description. 
		
		Scanner sc = new Scanner(System.in);
        Random rand = new Random();
        PointScanner[] scanners = new PointScanner[4];
        int trial = 1; // Tracks the number of trials
        
        System.out.println("Performances of Four Sorting Algorithms in Point Scanning");
        System.out.println("Keys: 1 (random integers) 2 (file input) 3 (exit)");
        
        while (true) {
            System.out.print("Trial " + trial + ": ");
            int choice = sc.nextInt();

            if (choice == 3) {
                break;
            }
            
            Point[] points = null;
            
            // Clear previous scanners
            scanners = new PointScanner[4];
            
            // Random integers
            if (choice == 1) {
                System.out.print("Enter number of random points: ");
                int numPts = sc.nextInt();
                points = generateRandomPoints(numPts, rand);
                scanners[0] = new PointScanner(points, Algorithm.SelectionSort);
                scanners[1] = new PointScanner(points, Algorithm.InsertionSort);
                scanners[2] = new PointScanner(points, Algorithm.MergeSort);
                scanners[3] = new PointScanner(points, Algorithm.QuickSort);
            } 
            
            // File input
            else if (choice == 2) {
                System.out.println("Points from a file");
                System.out.print("File name: ");
                String file = sc.next();
                try {
                    scanners[0] = new PointScanner(file, Algorithm.SelectionSort);
                    scanners[1] = new PointScanner(file, Algorithm.InsertionSort);
                    scanners[2] = new PointScanner(file, Algorithm.MergeSort);
                    scanners[3] = new PointScanner(file, Algorithm.QuickSort);
                } catch (FileNotFoundException e) {
                    System.out.println("File not found. Try again.");
                    continue;
                } catch (InputMismatchException e) {
                    System.out.println("Invalid file format. Must contain even number of integers.");
                    continue;
                }
            }
            else {
                System.out.println("Invalid choice. Try again.");
                continue;
            }

            // Performs scans
            for (PointScanner scanner : scanners) {
                if (scanner != null) {
                    scanner.scan();
                }
            }

            // Print statistics
            System.out.println("algorithm    size    time (ns)");
            System.out.println("----------------------------");
            for (PointScanner scanner : scanners) {
                System.out.println(scanner.stats());
            }
            System.out.println("----------------------------");
            trial++;
        }

        sc.close();
    }
	
	
	/**
	 * This method generates a given number of random points.
	 * The coordinates of these points are pseudo-random numbers within the range 
	 * [-50,50] � [-50,50]. Please refer to Section 3 on how such points can be generated.
	 * 
	 * Ought to be private. Made public for testing. 
	 * 
	 * @param numPts  	number of points
	 * @param rand      Random object to allow seeding of the random number generator
	 * @throws IllegalArgumentException if numPts < 1
	 */
	public static Point[] generateRandomPoints(int numPts, Random rand) throws IllegalArgumentException
	{ 
		if (numPts < 1) {
			throw new IllegalArgumentException("Number of points cant be less than 1");
		}
		
		Point[] points = new Point[numPts];
        for (int i = 0; i < numPts; i++) {
            int x = rand.nextInt(101) - 50; // Random integer between -50 and 50
            int y = rand.nextInt(101) - 50; // Random integer between -50 and 50
            points[i] = new Point(x, y);
        }
        return points;
	}
	
}
