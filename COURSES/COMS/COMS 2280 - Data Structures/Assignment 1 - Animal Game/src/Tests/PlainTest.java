package edu.iastate.cs2280.hw1;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

public class PlainTest {
    private Plain plain;

    @Before
    public void setUp() {
        plain = new Plain(3);
    }

    @Test
    public void testConstructorWithWidth() {
        assertEquals(3, plain.getWidth());
        assertNotNull(plain.grid);
    }

    @Test
    public void testRandomInit() {
        plain.randomInit();
        boolean hasBadger = false;
        boolean hasFox = false;
        boolean hasRabbit = false;
        boolean hasGrass = false;
        boolean hasEmpty = false;

        for (int i = 0; i < plain.getWidth(); i++) {
            for (int j = 0; j < plain.getWidth(); j++) {
                if (plain.grid[i][j] instanceof Badger) hasBadger = true;
                if (plain.grid[i][j] instanceof Fox) hasFox = true;
                if (plain.grid[i][j] instanceof Rabbit) hasRabbit = true;
                if (plain.grid[i][j] instanceof Grass) hasGrass = true;
                if (plain.grid[i][j] instanceof Empty) hasEmpty = true;
            }
        }

        assertTrue(hasBadger);
        assertTrue(hasFox);
        assertTrue(hasRabbit);
        assertTrue(hasGrass);
        assertTrue(hasEmpty);
    }

    @Test
    public void testToString() {
        plain.grid[0][0] = new Badger(plain, 0, 0, 0);
        plain.grid[0][1] = new Empty(plain, 0, 1);
        plain.grid[0][2] = new Fox(plain, 0, 2, 0);
        plain.grid[1][0] = new Grass(plain, 1, 0);
        plain.grid[1][1] = new Rabbit(plain, 1, 1, 0);
        plain.grid[1][2] = new Empty(plain, 1, 2);
        plain.grid[2][0] = new Fox(plain, 2, 0, 0);
        plain.grid[2][1] = new Grass(plain, 2, 1);
        plain.grid[2][2] = new Badger(plain, 2, 2, 0);

        String expected = "B0 E  F0 \nG  R0 E  \nF0 G  B0 \n";
        assertEquals(expected, plain.toString());
    }
}