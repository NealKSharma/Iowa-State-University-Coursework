package edu.iastate.cs2280.hw1;

/**
 *  
 * @author Neal Kaushik Sharma
 *
 */

/**
 * 
 * Living refers to the life form occupying a square in a plain grid. It is a 
 * superclass of Empty, Grass, and Animal, the latter of which is in turn a superclass
 * of Badger, Fox, and Rabbit. Living has two abstract methods awaiting implementation. 
 *
 */
public abstract class Living 
{
	protected Plain plain; // the plain in which the life form resides
	protected int row;     // location of the square on which 
	protected int column;  // the life form resides
	
	// constants to be used as indices. 
	protected static final int BADGER = 0; 
	protected static final int EMPTY = 1; 
	protected static final int FOX = 2; 
	protected static final int GRASS = 3; 
	protected static final int RABBIT = 4; 
	
	public static final int NUM_LIFE_FORMS = 5; 
	
	// life expectancies 
	public static final int BADGER_MAX_AGE = 4; 
	public static final int FOX_MAX_AGE = 6; 
	public static final int RABBIT_MAX_AGE = 3; 
	
	/**
     * Constructor for Living class
     * @param p: plain
     * @param r: row position
     * @param c: column position
     */
    public Living(Plain p, int r, int c) {
        this.plain = p;
        this.row = r;
        this.column = c;
    }
	
	/**
	 * Censuses all life forms in the 3 X 3 neighborhood in a plain. 
	 * @param population  counts of all life forms
	 */
	protected void census(int population[ ])
	{		
		// Count the numbers of Badgers, Empties, Foxes, Grasses, and Rabbits  
		// in the 3x3 neighborhood centered at this Living object.  Store the 
		// counts in the array population[] at indices 0, 1, 2, 3, 4, respectively.
		
		// 1x1 Grid
				if (plain.grid.length == 1) {
					if (plain.grid[0][0].who() == State.BADGER) {
						population[BADGER]++;
					} else if (plain.grid[0][0].who() == State.EMPTY) {
						population[EMPTY]++;
					} else if (plain.grid[0][0].who() == State.FOX) {
						population[FOX]++;
					} else if (plain.grid[0][0].who() == State.GRASS) {
						population[GRASS]++;
					} else if (plain.grid[0][0].who() == State.RABBIT) {
						population[RABBIT]++;
					}
				}

				// Object in top left corner. 2x2 neighborhood.
				else if (row == 0 && column == 0) {
					for (int i = row; i <= row + 1; i++) {
						for (int j = column; j <= column + 1; j++) {
							if (plain.grid[i][j].who() == State.BADGER) {
								population[BADGER]++;
							} else if (plain.grid[i][j].who() == State.EMPTY) {
								population[EMPTY]++;
							} else if (plain.grid[i][j].who() == State.FOX) {
								population[FOX]++;
							} else if (plain.grid[i][j].who() == State.GRASS) {
								population[GRASS]++;
							} else if (plain.grid[i][j].who() == State.RABBIT) {
								population[RABBIT]++;
							}
						}
					}
				}

				// Object in top right corner. 2x2 neighborhood.
				else if (row == 0 && column == plain.getWidth() - 1) {
					for (int i = row; i <= row + 1; i++) {
						for (int j = column - 1; j < column + 1; j++) {
							if (plain.grid[i][j].who() == State.BADGER) {
								population[BADGER]++;
							} else if (plain.grid[i][j].who() == State.EMPTY) {
								population[EMPTY]++;
							} else if (plain.grid[i][j].who() == State.FOX) {
								population[FOX]++;
							} else if (plain.grid[i][j].who() == State.GRASS) {
								population[GRASS]++;
							} else if (plain.grid[i][j].who() == State.RABBIT) {
								population[RABBIT]++;
							}
						}
					}
				}

				// Object in bottom left corner. 2x2 neighborhood.
				else if (row == plain.getWidth() - 1 && column == 0) {
					for (int i = row - 1; i <= row; i++) {
						for (int j = column; j <= column + 1; j++) {
							if (plain.grid[i][j].who() == State.BADGER) {
								population[BADGER]++;
							} else if (plain.grid[i][j].who() == State.EMPTY) {
								population[EMPTY]++;
							} else if (plain.grid[i][j].who() == State.FOX) {
								population[FOX]++;
							} else if (plain.grid[i][j].who() == State.GRASS) {
								population[GRASS]++;
							} else if (plain.grid[i][j].who() == State.RABBIT) {
								population[RABBIT]++;
							}
						}
					}
				}

				// Object in bottom right corner. 2x2 neighborhood.
				else if (row == plain.getWidth() - 1 && column == plain.getWidth() - 1) {
					for (int i = row - 1; i <= row; i++) {
						for (int j = column - 1; j <= column; j++) {
							if (plain.grid[i][j].who() == State.BADGER) {
								population[BADGER]++;
							} else if (plain.grid[i][j].who() == State.EMPTY) {
								population[EMPTY]++;
							} else if (plain.grid[i][j].who() == State.FOX) {
								population[FOX]++;
							} else if (plain.grid[i][j].who() == State.GRASS) {
								population[GRASS]++;
							} else if (plain.grid[i][j].who() == State.RABBIT) {
								population[RABBIT]++;
							}
						}
					}
				}

				// Object in top row. 2x3 neighborhood.
				else if (row == 0) {
					for (int i = row; i <= row + 1; i++) {
						for (int j = column - 1; j <= column + 1; j++) {
							if (plain.grid[i][j].who() == State.BADGER) {
								population[BADGER]++;
							} else if (plain.grid[i][j].who() == State.EMPTY) {
								population[EMPTY]++;
							} else if (plain.grid[i][j].who() == State.FOX) {
								population[FOX]++;
							} else if (plain.grid[i][j].who() == State.GRASS) {
								population[GRASS]++;
							} else if (plain.grid[i][j].who() == State.RABBIT) {
								population[RABBIT]++;
							}
						}
					}
				}

				// Object in bottom row. 2x3 neighborhood.
				else if (row == plain.getWidth() - 1) {
					for (int i = row - 1; i <= row; i++) {
						for (int j = column - 1; j <= column + 1; j++) {
							if (plain.grid[i][j].who() == State.BADGER) {
								population[BADGER]++;
							} else if (plain.grid[i][j].who() == State.EMPTY) {
								population[EMPTY]++;
							} else if (plain.grid[i][j].who() == State.FOX) {
								population[FOX]++;
							} else if (plain.grid[i][j].who() == State.GRASS) {
								population[GRASS]++;
							} else if (plain.grid[i][j].who() == State.RABBIT) {
								population[RABBIT]++;
							}
						}
					}
				}

				// Object in left column. 3x2 neighborhood.
				else if (column == 0) {
					for (int i = row - 1; i <= row + 1; i++) {
						for (int j = column; j <= column + 1; j++) {
							if (plain.grid[i][j].who() == State.BADGER) {
								population[BADGER]++;
							} else if (plain.grid[i][j].who() == State.EMPTY) {
								population[EMPTY]++;
							} else if (plain.grid[i][j].who() == State.FOX) {
								population[FOX]++;
							} else if (plain.grid[i][j].who() == State.GRASS) {
								population[GRASS]++;
							} else if (plain.grid[i][j].who() == State.RABBIT) {
								population[RABBIT]++;
							}
						}
					}
				}

				// Object in right column. 3x2 neighborhood.
				else if (column == plain.getWidth() - 1) {
					for (int i = row - 1; i <= row + 1; i++) {
						for (int j = column - 1; j <= column; j++) {
							if (plain.grid[i][j].who() == State.BADGER) {
								population[BADGER]++;
							} else if (plain.grid[i][j].who() == State.EMPTY) {
								population[EMPTY]++;
							} else if (plain.grid[i][j].who() == State.FOX) {
								population[FOX]++;
							} else if (plain.grid[i][j].who() == State.GRASS) {
								population[GRASS]++;
							} else if (plain.grid[i][j].who() == State.RABBIT) {
								population[RABBIT]++;
							}
						}
					}
				} else {
					for (int i = row - 1; i <= row + 1; i++) {
						for (int j = column - 1; j <= column + 1; j++) {
							if (plain.grid[i][j].who() == State.BADGER) {
								population[BADGER]++;
							} else if (plain.grid[i][j].who() == State.EMPTY) {
								population[EMPTY]++;
							} else if (plain.grid[i][j].who() == State.FOX) {
								population[FOX]++;
							} else if (plain.grid[i][j].who() == State.GRASS) {
								population[GRASS]++;
							} else if (plain.grid[i][j].who() == State.RABBIT) {
								population[RABBIT]++;
							}
						}
					}
				}
			}

	/**
	 * Gets the identity of the life form on the square.
	 * @return State
	 */
	public abstract State who();
	// To be implemented in each class of Badger, Empty, Fox, Grass, and Rabbit. 
	// 
	// There are five states given in State.java. Include the prefix State in   
	// the return value, e.g., return State.Fox instead of Fox.  
	
	/**
	 * Determines the life form on the square in the next cycle.
	 * @param  pNew  plain of the next cycle
	 * @return Living 
	 */
	public abstract Living next(Plain pNew); 
	// To be implemented in the classes Badger, Empty, Fox, Grass, and Rabbit. 
	// 
	// For each class (life form), carry out the following: 
	// 
	// 1. Obtains counts of life forms in the 3x3 neighborhood of the class object. 

	// 2. Applies the survival rules for the life form to determine the life form  
	//    (on the same square) in the next cycle.  These rules are given in the  
	//    project description. 
	// 
	// 3. Generate this new life form at the same location in the plain pNew.      

}
