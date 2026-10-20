package edu.iastate.cs2280.hw2;

/**
 *  
 * @author Neal Kaushik Sharma
 *
 */

/**
 * 
 * This class implements insertion sort.   
 *
 */

public class InsertionSorter extends AbstractSorter 
{
	// Other private instance variables if you need ... 
	
	/**
	 * Constructor takes an array of points.  It invokes the superclass constructor, and also 
	 * set the instance variables algorithm in the superclass.
	 * 
	 * @param pts  
	 */
	public InsertionSorter(Point[] pts) {
		super(pts); // Calls the superclass constructor
		algorithm = "InsertionSort";
	}	

	
	/** 
	 * Perform insertion sort on the array points[] of the parent class AbstractSorter.  
	 */
	@Override 
	public void sort() {
		
		for (int i = 1; i < points.length; i++) {
			Point p = points[i];
			int j = i - 1;
			while (j >= 0 && pointComparator.compare(points[j], p) > 0) {
				points[j + 1] = points[j];
				j--;
			}
			points[j + 1] = p;
		}
	}		
}
