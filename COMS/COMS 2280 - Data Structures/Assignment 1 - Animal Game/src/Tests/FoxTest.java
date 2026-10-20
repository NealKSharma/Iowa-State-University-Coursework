package edu.iastate.cs2280.hw1;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

// Test class for Fox.
public class FoxTest {
    private Plain plain;
    private Fox fox;

    @Before
    public void setUp() {
        plain = new Plain(3);
        fox = new Fox(plain, 1, 1, 0);
    }

    @Test
    public void testWho() {
        assertEquals(State.FOX, fox.who());
    }

    @Test
    public void testNextFoxAges() {
        fox = new Fox(plain, 1, 1, 5); // Fox at max age
        Living next = fox.next(plain);
        assertTrue(next instanceof Empty);
    }

    @Test
    public void testNextFoxOutnumberedByBadgers() {
        plain.grid[0][0] = new Badger(plain, 0, 0, 0);
        plain.grid[0][1] = new Badger(plain, 0, 1, 0);
        plain.grid[0][2] = new Badger(plain, 0, 2, 0);
        plain.grid[1][0] = new Badger(plain, 1, 0, 0);
        plain.grid[1][2] = new Badger(plain, 1, 2, 0);
        plain.grid[2][0] = new Badger(plain, 2, 0, 0);
        plain.grid[2][1] = new Badger(plain, 2, 1, 0);
        plain.grid[2][2] = new Badger(plain, 2, 2, 0);
        Living next = fox.next(plain);
        assertTrue(next instanceof Badger);
    }

    @Test
    public void testNextFoxStarves() {
        plain.grid[0][0] = new Rabbit(plain, 0, 0, 0);
        plain.grid[0][1] = new Rabbit(plain, 0, 1, 0);
        plain.grid[0][2] = new Rabbit(plain, 0, 2, 0);
        plain.grid[1][0] = new Rabbit(plain, 1, 0, 0);
        plain.grid[1][2] = new Rabbit(plain, 1, 2, 0);
        plain.grid[2][0] = new Rabbit(plain, 2, 0, 0);
        plain.grid[2][1] = new Rabbit(plain, 2, 1, 0);
        plain.grid[2][2] = new Rabbit(plain, 2, 2, 0);
        Living next = fox.next(plain);
        assertTrue(next instanceof Empty);
    }

    @Test
    public void testNextFoxSurvives() {
        plain.grid[0][0] = new Rabbit(plain, 0, 0, 0);
        plain.grid[0][1] = new Rabbit(plain, 0, 1, 0);
        plain.grid[0][2] = new Rabbit(plain, 0, 2, 0);
        plain.grid[1][0] = new Rabbit(plain, 1, 0, 0);
        plain.grid[1][2] = new Rabbit(plain, 1, 2, 0);
        plain.grid[2][0] = new Rabbit(plain, 2, 0, 0);
        plain.grid[2][1] = new Rabbit(plain, 2, 1, 0);
        plain.grid[2][2] = new Rabbit(plain, 2, 2, 0);
        Living next = fox.next(plain);
        assertTrue(next instanceof Fox);
    }
}