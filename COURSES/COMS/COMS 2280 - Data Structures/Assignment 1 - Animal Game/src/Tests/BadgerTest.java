package edu.iastate.cs2280.hw1;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

// Test class for Badger.
public class BadgerTest {
    private Plain plain;
    private Badger badger;

    @Before
    public void setUp() {
        plain = new Plain(3);
        badger = new Badger(plain, 1, 1, 0);
    }
    
    @Test
	public void testBadgerConstructor() // Tests the badger constructor
	{
		Plain p = new Plain(3);
		Badger b = new Badger(p, 1, 2, 3);
		assertEquals(b.row, 1);
		assertEquals(b.column, 2);
		assertEquals(b.plain, p);
		assertEquals(b.age, 3);
	}

    @Test
    public void testWho() {
        assertEquals(State.BADGER, badger.who());
    }

    @Test
    public void testNextBadgerAges() {
        badger = new Badger(plain, 1, 1, 4); // Badger at max age
        Living next = badger.next(plain);
        assertTrue(next instanceof Empty);
    }

    @Test
    public void testNextBadgerIsolated() {
        plain.grid[0][0] = new Fox(plain, 0, 0, 0);
        plain.grid[0][1] = new Fox(plain, 0, 1, 0);
        plain.grid[0][2] = new Fox(plain, 0, 2, 0);
        plain.grid[1][0] = new Fox(plain, 1, 0, 0);
        plain.grid[1][2] = new Fox(plain, 1, 2, 0);
        plain.grid[2][0] = new Fox(plain, 2, 0, 0);
        plain.grid[2][1] = new Fox(plain, 2, 1, 0);
        plain.grid[2][2] = new Fox(plain, 2, 2, 0);
        Living next = badger.next(plain);
        assertTrue(next instanceof Fox);
    }

    @Test
    public void testNextBadgerStarves() {
        plain.grid[0][0] = new Rabbit(plain, 0, 0, 0);
        plain.grid[0][1] = new Rabbit(plain, 0, 1, 0);
        plain.grid[0][2] = new Rabbit(plain, 0, 2, 0);
        plain.grid[1][0] = new Rabbit(plain, 1, 0, 0);
        plain.grid[1][2] = new Rabbit(plain, 1, 2, 0);
        plain.grid[2][0] = new Rabbit(plain, 2, 0, 0);
        plain.grid[2][1] = new Rabbit(plain, 2, 1, 0);
        plain.grid[2][2] = new Rabbit(plain, 2, 2, 0);
        Living next = badger.next(plain);
        assertTrue(next instanceof Empty);
    }

    @Test
    public void testNextBadgerSurvives() {
        plain.grid[0][0] = new Rabbit(plain, 0, 0, 0);
        plain.grid[0][1] = new Rabbit(plain, 0, 1, 0);
        plain.grid[0][2] = new Rabbit(plain, 0, 2, 0);
        plain.grid[1][0] = new Rabbit(plain, 1, 0, 0);
        plain.grid[1][2] = new Rabbit(plain, 1, 2, 0);
        plain.grid[2][0] = new Rabbit(plain, 2, 0, 0);
        plain.grid[2][1] = new Rabbit(plain, 2, 1, 0);
        plain.grid[2][2] = new Rabbit(plain, 2, 2, 0);
        Living next = badger.next(plain);
        assertTrue(next instanceof Badger);
    }
}