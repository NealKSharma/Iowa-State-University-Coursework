package edu.iastate.cs2280.hw1;

import static org.junit.Assert.*;
import java.io.FileNotFoundException;
import org.junit.Test;

public class LivingTest {
    private Plain plain;
    private TestLiving living;

    // Test class for living.
    private class TestLiving extends Living {
        public TestLiving(Plain p, int r, int c) {
            super(p, r, c);
        }

        @Override
        public State who() {
            return State.EMPTY;
        }

        @Override
        public Living next(Plain pNew) {
            return new Empty(pNew, row, column);
        }
    }
    
    @Test
	public void testCensus1() throws FileNotFoundException {
		
		int[] population = new int[5];
		int[] compare = {1, 1, 4, 2, 1};  // Population count.
		
		Plain plain = new Plain("public1-3x3.txt");
	
		plain.grid[1][1].census(population);
		assertArrayEquals(population, compare);  // If true, census correctly filled population array for the grid.
	}
    
    @Test
	public void testCensus2() throws FileNotFoundException {
		
		int[] population = new int[5];
		int[] compare = {10, 24, 6, 30, 20};  // Population count.
		
		Plain plain = new Plain("public3-10x10.txt");
	
		plain.grid[1][1].census(population);
		assertArrayEquals(population, compare);  // If true, census correctly filled population array for the grid.
	}

    @Test
    public void testWho() {
        assertEquals(State.EMPTY, living.who());
    }

    @Test
    public void testNext() {
        Living next = living.next(plain);
        assertTrue(next instanceof Empty);
    }
}