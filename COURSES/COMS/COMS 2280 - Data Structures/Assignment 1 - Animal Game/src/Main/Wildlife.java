package edu.iastate.cs2280.hw1;

import java.io.FileNotFoundException;
import java.util.Scanner; 

/**
 *  
 * @author Neal Kaushik Sharma
 *
 */

/**
 * 
 * The Wildlife class performs a simulation of a grid plain with
 * squares inhabited by badgers, foxes, rabbits, grass, or none. 
 *
 */
public class Wildlife 
{
	/**
	 * Update the new plain from the old plain in one cycle. 
	 * @param pOld  old plain
	 * @param pNew  new plain 
	 */
	public static void updatePlain(Plain pOld, Plain pNew)
	{
		for (int i = 0; i < pOld.getWidth(); i++) {
            for (int j = 0; j < pOld.getWidth(); j++) {
                pNew.grid[i][j] = pOld.grid[i][j].next(pNew);
            }
        }
	}
	
	/**
	 * Repeatedly generates plains either randomly or from reading files. 
	 * Over each plain, carries out an input number of cycles of evolution. 
	 * @param args
	 * @throws FileNotFoundException
	 */
	public static void main(String[] args) throws FileNotFoundException
	{		
		Plain even = null;   				 // the plain after an even number of cycles 
		Plain odd = null;                   // the plain after an odd number of cycles
		
		Scanner scanner = new Scanner(System.in);
		int width = 0;
		int trials = 1; // Number of trials which have taken place.
		
		while (true) {
			System.out.println("Trial " + trials + ": ");
            System.out.println("Simulation of Wildlife of the Plain");
            System.out.println("keys: 1 (random plain) 2 (file input) 3 (exit)");
            
            int choice = scanner.nextInt();

            if (choice == 3) {
                break;
            }

            if (choice == 1) {
            	System.out.println("Random Plain");
            	System.out.println("Enter grid width:");
            	width = scanner.nextInt();
            	while (width < 1) {
            		System.out.println("Invalid Width (Has to be more than 1).");
            		System.out.println("Enter grid width: ");
            		width = scanner.nextInt();
            	}
                odd = new Plain(width);
                even = new Plain(odd.getWidth());
                odd.randomInit();
            }
            
            else if (choice == 2) {
                System.out.println("Enter file name:");
                String fileName = scanner.next();
                odd = new Plain(fileName);
                even = new Plain(odd.getWidth());
            }

            System.out.println("Enter the number of cycles:");
            int cycles = scanner.nextInt();

            System.out.println("Initial plain:");
            System.out.println(odd);

            for (int i = 0; i < cycles; i++) {
            	// cycles is even.
                if (i % 2 == 0) {
                    updatePlain(odd, even);
                } 
                // cycles is odd.
                else {
                    updatePlain(even, odd);
                }
            }

            System.out.println("Final plain:");
            if (cycles % 2 == 0) {
                System.out.println(odd);
            } else {
                System.out.println(even);
            }
            trials++; // Incremented after each loop.
        }
        scanner.close();
	}
}
