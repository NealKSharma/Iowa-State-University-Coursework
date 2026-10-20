package edu.iastate.cs2280.hw1;

/**
 *  
 * @author Neal Kaushik Sharma
 *
 */

/*
 * This class is to be extended by the Badger, Fox, and Rabbit classes. 
 */
public abstract class Animal extends Living implements MyAge
{
	protected int age;   // age of the animal
	
	/**
     * Constructor for Animal class
     * @param p: plain
     * @param r: row position
     * @param c: column position
     * @param a: age
     */
    public Animal(Plain p, int r, int c, int a) {
        super(p, r, c);
        this.age = a;
    }

	@Override
	/**
	 * @return age of the animal 
	 */
	public int myAge()
	{
		return this.age;
	}
}
