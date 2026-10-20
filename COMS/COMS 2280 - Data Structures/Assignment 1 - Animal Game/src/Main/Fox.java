package edu.iastate.cs2280.hw1;

/**
 *  
 * @author Neal Kaushik Sharma
 *
 */

/**
 * A fox eats rabbits and competes against a badger. 
 */
public class Fox extends Animal 
{
	
	/**
	 * Constructor 
	 * @param p: plain
	 * @param r: row position 
	 * @param c: column position
	 * @param a: age 
	 */
	public Fox (Plain p, int r, int c, int a) 
	{
		super(p, r, c, a); 
	}
		
	/**
	 * A fox occupies the square. 	 
	 */
	public State who()
	{
		return State.FOX;
	}
	
	/**
	 * A fox dies of old age or hunger, or from attack by numerically superior badgers. 
	 * @param pNew     plain of the next cycle
	 * @return Living  life form occupying the square in the next cycle. 
	 */
	public Living next(Plain pNew)
	{		
		int[] population = new int[NUM_LIFE_FORMS];
        census(population);

        if (age == FOX_MAX_AGE) {
            return new Empty(pNew, row, column);
        }else if (population[BADGER] > population[FOX]) {
            return new Badger(pNew, row, column, 0);
        } else if (population[BADGER] + population[FOX] > population[RABBIT]) {
            return new Empty(pNew, row, column);
        } else {
            return new Fox(pNew, row, column, age + 1);
        }
    }
}
