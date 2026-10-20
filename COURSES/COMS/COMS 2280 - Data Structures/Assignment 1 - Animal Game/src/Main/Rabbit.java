package edu.iastate.cs2280.hw1;

/**
 *  
 * @author Neal Kaushik Sharma
 *
 */

/*
 * A rabbit eats grass and lives no more than three years.
 */
public class Rabbit extends Animal 
{	
	/**
	 * Creates a Rabbit object.
	 * @param p: plain  
	 * @param r: row position 
	 * @param c: column position
	 * @param a: age 
	 */
	public Rabbit (Plain p, int r, int c, int a) 
	{
		super(p, r, c, a);
	}
		
	// Rabbit occupies the square.
	public State who()
	{
		return State.RABBIT;
	}
	
	/**
	 * A rabbit dies of old age or hunger. It may also be eaten by a badger or a fox.  
	 * @param pNew     plain of the next cycle 
	 * @return Living  new life form occupying the same square
	 */
	public Living next(Plain pNew)
	{
		int[] population = new int[NUM_LIFE_FORMS];
        census(population);

        if (age == RABBIT_MAX_AGE) {
            return new Empty(pNew, row, column);
        } else if (population[GRASS] == 0) {
            return new Empty(pNew, row, column);
        } else if (population[FOX] + population[BADGER] >= population[RABBIT] && population[FOX] > population[BADGER]) {
            return new Fox(pNew, row, column, 0);
        } else if (population[BADGER] > population[RABBIT]) {
            return new Badger(pNew, row, column, 0);
        } else {
            return new Rabbit(pNew, row, column, age + 1);
        }
	}
}
