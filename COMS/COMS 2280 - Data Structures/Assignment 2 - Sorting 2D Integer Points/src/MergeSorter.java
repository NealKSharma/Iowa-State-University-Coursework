package edu.iastate.cs2280.hw2;

/**
 *  
 * @author Neal Kaushik Sharma
 *
 */

/**
 * 
 * This class implements the mergesort algorithm.   
 *
 */

public class MergeSorter extends AbstractSorter
{
	// Other private instance variables if needed
	
	/** 
	 * Constructor takes an array of points.  It invokes the superclass constructor, and also 
	 * set the instance variables algorithm in the superclass.
	 *  
	 * @param pts   input array of integers
	 */
	public MergeSorter(Point[] pts) 
	{
        super(pts); // Calls the superclass constructor
        algorithm = "MergeSort";
    }


	/**
	 * Perform mergesort on the array points[] of the parent class AbstractSorter. 
	 * 
	 */
	@Override 
	public void sort()
	{
		mergeSortRec(points); 
	}

	
	/**
	 * This is a recursive method that carries out mergesort on an array pts[] of points. One 
	 * way is to make copies of the two halves of pts[], recursively call mergeSort on them, 
	 * and merge the two sorted subarrays into pts[].   
	 * 
	 * @param pts	point array 
	 */
	private void mergeSortRec(Point[] pts)
	{
		if (pts.length <= 1) {
            return;
		}
            
		// Split the array into two halves
        int mid = pts.length / 2;
        Point[] left = new Point[mid];
        Point[] right = new Point[pts.length - mid];

        // Copy elements to left array
        for (int i = 0; i < mid; i++) {
            left[i] = pts[i];
        }
        
        // Copy elements to right array
        for (int j = 0; j < right.length; j++) {
            right[j] = pts[mid + j];
        }

        // Recursively sort both halves
        mergeSortRec(left);
        mergeSortRec(right);

        // Merge the sorted halves
        merge(pts, left, right);
	}

	/**
     * Merges two sorted arrays into one sorted array.
     *
     * @param pts   the original array to store the merged result
     * @param left  the left half of the array
     * @param right the right half of the array
     */
    private void merge(Point[] pts, Point[] left, Point[] right) {
    	int l = 0;
		int r = 0;
		int index = 0;
		while ((l < left.length) && (r < right.length)) {
			if (pointComparator.compare(left[l], right[r]) < 0) {
				pts[index] = left[l++];
			} else {
				pts[index] = right[r++];
			}
			index++;
		}

        // Copy remaining elements of left[] if any
		while (l < left.length) {
			pts[index++] = left[l++];
		}

        // Copy remaining elements of right[] if any
		while (r < right.length) {
			pts[index++] = right[r++];
		}
    }

}
