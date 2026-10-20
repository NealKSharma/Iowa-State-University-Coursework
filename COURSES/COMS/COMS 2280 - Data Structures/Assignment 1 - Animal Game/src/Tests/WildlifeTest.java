package edu.iastate.cs2280.hw1;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

// Test class for Wildlife.
public class WildlifeTest {
    private Plain pOld;
    private Plain pNew;

    @Before
    public void setUp() {
        pOld = new Plain(3);
        pNew = new Plain(3);
    }

    @Test
    public void testUpdatePlain() {
        pOld.grid[0][0] = new Rabbit(pOld, 0, 0, 0);
        pOld.grid[0][1] = new Grass(pOld, 0, 1);
        pOld.grid[0][2] = new Empty(pOld, 0, 2);
        pOld.grid[1][0] = new Fox(pOld, 1, 0, 0);
        pOld.grid[1][1] = new Badger(pOld, 1, 1, 0);
        pOld.grid[1][2] = new Grass(pOld, 1, 2);
        pOld.grid[2][0] = new Empty(pOld, 2, 0);
        pOld.grid[2][1] = new Rabbit(pOld, 2, 1, 0);
        pOld.grid[2][2] = new Fox(pOld, 2, 2, 0);

        Wildlife.updatePlain(pOld, pNew);

        assertTrue(pNew.grid[0][0] instanceof Empty); // Rabbit dies of old age
        assertTrue(pNew.grid[0][1] instanceof Grass); // Grass remains
        assertTrue(pNew.grid[0][2] instanceof Empty); // Empty remains
        assertTrue(pNew.grid[1][0] instanceof Fox); // Fox remains
        assertTrue(pNew.grid[1][1] instanceof Badger); // Badger remains
        assertTrue(pNew.grid[1][2] instanceof Grass); // Grass remains
        assertTrue(pNew.grid[2][0] instanceof Empty); // Empty remains
        assertTrue(pNew.grid[2][1] instanceof Rabbit); // Rabbit remains
        assertTrue(pNew.grid[2][2] instanceof Fox); // Fox remains
    }

    @Test
    public void testSimulation() {
        // Simulating the main method without any input.
        Plain odd = new Plain(3);
        Plain even = new Plain(3);
        odd.randomInit();

        int cycles = 5;

        for (int i = 0; i < cycles; i++) {
            if (i % 2 == 0) {
                Wildlife.updatePlain(odd, even);
            } else {
                Wildlife.updatePlain(even, odd);
            }
        }

        Plain finalPlain = (cycles % 2 == 0) ? odd : even;
        assertNotNull(finalPlain);
    }
}