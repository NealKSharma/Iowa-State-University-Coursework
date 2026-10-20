package edu.iastate.cs2280.hw1;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

// Test class for Empty.
public class EmptyTest {
    private Plain plain;
    private Empty empty;

    @Before
    public void setUp() {
        plain = new Plain(3);
        empty = new Empty(plain, 1, 1);
    }

    @Test
    public void testWho() {
        assertEquals(State.EMPTY, empty.who());
    }

    @Test
    public void testNextOccupiedByRabbit() {
        plain.grid[0][0] = new Rabbit(plain, 0, 0, 0);
        plain.grid[0][1] = new Rabbit(plain, 0, 1, 0);
        plain.grid[0][2] = new Rabbit(plain, 0, 2, 0);
        Living next = empty.next(plain);
        assertTrue(next instanceof Rabbit);
    }

    @Test
    public void testNextOccupiedByFox() {
        plain.grid[0][0] = new Fox(plain, 0, 0, 0);
        plain.grid[0][1] = new Fox(plain, 0, 1, 0);
        plain.grid[0][2] = new Fox(plain, 0, 2, 0);
        Living next = empty.next(plain);
        assertTrue(next instanceof Fox);
    }

    @Test
    public void testNextOccupiedByBadger() {
        plain.grid[0][0] = new Badger(plain, 0, 0, 0);
        plain.grid[0][1] = new Badger(plain, 0, 1, 0);
        plain.grid[0][2] = new Badger(plain, 0, 2, 0);
        Living next = empty.next(plain);
        assertTrue(next instanceof Badger);
    }

    @Test
    public void testNextOccupiedByGrass() {
        plain.grid[0][0] = new Grass(plain, 0, 0);
        plain.grid[0][1] = new Grass(plain, 0, 1);
        plain.grid[0][2] = new Grass(plain, 0, 2);
        Living next = empty.next(plain);
        assertTrue(next instanceof Grass);
    }

    @Test
    public void testNextRemainsEmpty() {
        Living next = empty.next(plain);
        assertTrue(next instanceof Empty);
    }
}