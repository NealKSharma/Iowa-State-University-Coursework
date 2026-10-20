package edu.iastate.cs2280.hw1;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

// Test class for Grass.
public class GrassTest {
    private Plain plain;
    private Grass grass;

    @Before
    public void setUp() {
        plain = new Plain(3);
        grass = new Grass(plain, 1, 1);
    }

    @Test
    public void testWho() {
        assertEquals(State.GRASS, grass.who());
    }

    @Test
    public void testNextGrassEaten() {
        plain.grid[0][0] = new Rabbit(plain, 0, 0, 0);
        plain.grid[0][1] = new Rabbit(plain, 0, 1, 0);
        plain.grid[0][2] = new Rabbit(plain, 0, 2, 0);
        plain.grid[1][0] = new Rabbit(plain, 1, 0, 0);
        plain.grid[1][2] = new Rabbit(plain, 1, 2, 0);
        plain.grid[2][0] = new Rabbit(plain, 2, 0, 0);
        plain.grid[2][1] = new Rabbit(plain, 2, 1, 0);
        plain.grid[2][2] = new Rabbit(plain, 2, 2, 0);
        Living next = grass.next(plain);
        assertTrue(next instanceof Empty);
    }

    @Test
    public void testNextGrassTakenOverByRabbits() {
        plain.grid[0][0] = new Rabbit(plain, 0, 0, 0);
        plain.grid[0][1] = new Rabbit(plain, 0, 1, 0);
        plain.grid[0][2] = new Rabbit(plain, 0, 2, 0);
        plain.grid[1][0] = new Rabbit(plain, 1, 0, 0);
        plain.grid[1][2] = new Rabbit(plain, 1, 2, 0);
        plain.grid[2][0] = new Rabbit(plain, 2, 0, 0);
        plain.grid[2][1] = new Rabbit(plain, 2, 1, 0);
        plain.grid[2][2] = new Rabbit(plain, 2, 2, 0);
        Living next = grass.next(plain);
        assertTrue(next instanceof Rabbit);
    }

    @Test
    public void testNextGrassSurvives() {
        plain.grid[0][0] = new Rabbit(plain, 0, 0, 0);
        plain.grid[0][1] = new Rabbit(plain, 0, 1, 0);
        plain.grid[0][2] = new Rabbit(plain, 0, 2, 0);
        plain.grid[1][0] = new Rabbit(plain, 1, 0, 0);
        plain.grid[1][2] = new Rabbit(plain, 1, 2, 0);
        plain.grid[2][0] = new Rabbit(plain, 2, 0, 0);
        plain.grid[2][1] = new Rabbit(plain, 2, 1, 0);
        plain.grid[2][2] = new Rabbit(plain, 2, 2, 0);
        Living next = grass.next(plain);
        assertTrue(next instanceof Grass);
    }
}