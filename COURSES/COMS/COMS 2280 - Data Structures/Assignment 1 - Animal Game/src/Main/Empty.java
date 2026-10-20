package edu.iastate.cs2280.hw1;

/**
 *  
 * @author Neal Kaushik Sharma
 *
 */

/** 
 * Empty squares are competed by various forms of life.
 */
public class Empty extends Living 
{
	public Empty (Plain p, int r, int c) 
	{
		super(p, r, c);
	}
	
	public State who()
	{
		return State.EMPTY; 
	}
	
	/**
	 * An empty square will be occupied by a neighboring Badger, Fox, Rabbit, or Grass, or remain empty. 
	 * @param pNew     plain of the next life cycle.
	 * @return Living  life form in the next cycle.   
	 */
	public Living next(Plain pNew)
	{
		int[] population = new int[NUM_LIFE_FORMS];
        census(population);

        if (population[RABBIT] > 1) {
            return new Rabbit(pNew, row, column, 0);
        } else if (population[FOX] > 1) {
            return new Fox(pNew, row, column, 0);
        } else if (population[BADGER] > 1) {
            return new Badger(pNew, row, column, 0);
        } else if (population[GRASS] > 0) {
            return new Grass(pNew, row, column);
        } else {
            return new Empty(pNew, row, column);
        }
    }
}
