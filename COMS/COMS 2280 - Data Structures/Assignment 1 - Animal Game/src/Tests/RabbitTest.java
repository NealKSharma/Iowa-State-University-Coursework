package edu.iastate.cs2280.hw1;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

// Test class for Rabbit.
public class RabbitTest {
    private Plain plain;
    private Rabbit rabbit;

    @Before
    public void setUp() {
        plain = new Plain(3);
        rabbit = new Rabbit(plain, 1, 1, 0);
    }

    @Test
    public void testWho() {
        assertEquals(State.RABBIT, rabbit.who());
    }

    @Test
    public void testNextRabbitAges() {
        rabbit = new Rabbit(plain, 1, 1, 3); // Rabbit at max age
        Living next = rabbit.next(plain);
        assertTrue(next instanceof Empty);
    }

    @Test
    public void testNextRabbitStarves() {
        plain.grid[0][0] = new Grass(plain, 0, 0);
        plain.grid[0][1] = new Grass(plain, 0, 1);
        plain.grid[0][2] = new Grass(plain, 0, 2);
        plain.grid[1][0] = new Grass(plain, 1, 0);
        plain.grid[1][2] = new Grass(plain, 1, 2);
        plain.grid[2][0] = new Grass(plain, 2, 0);
        plain.grid[2][1] = new Grass(plain, 2, 1);
        plain.grid[2][2] = new Grass(plain, 2, 2);
        Living next = rabbit.next(plain);
        assertTrue(next instanceof Empty);
    }

    @Test
    public void testNextRabbitEatenByFox() {
        plain.grid[0][0] = new Fox(plain, 0, 0, 0);
        plain.grid[0][1] = new Fox(plain, 0, 1, 0);
        plain.grid[0][2] = new Fox(plain, 0, 2, 0);
        plain.grid[1][0] = new Fox(plain, 1, 0, 0);
        plain.grid[1][2] = new Fox(plain, 1, 2, 0);
        plain.grid[2][0] = new Fox(plain, 2, 0, 0);
        plain.grid[2][1] = new Fox(plain, 2, 1, 0);
        plain.grid[2][2] = new Fox(plain, 2, 2, 0);
        Living next = rabbit.next(plain);
        assertTrue(next instanceof Fox);
    }

    @Test
    public void testNextRabbitEatenByBadger() {
        plain.grid[0][0] = new Badger(plain, 0, 0, 0);
        plain.grid[0][1] = new Badger(plain, 0, 1, 0);
        plain.grid[0][2] = new Badger(plain, 0, 2, 0);
        plain.grid[1][0] = new Badger(plain, 1, 0, 0);
        plain.grid[1][2] = new Badger(plain, 1, 2, 0);
        plain.grid[2][0] = new Badger(plain, 2, 0, 0);
        plain.grid[2][1] = new Badger(plain, 2, 1, 0);
        plain.grid[2][2] = new Badger(plain, 2, 2, 0);
        Living next = rabbit.next(plain);
        assertTrue(next instanceof Badger);
    }

    @Test
    public void testNextRabbitSurvives() {
        plain.grid[0][0] = new Grass(plain, 0, 0);
        plain.grid[0][1] = new Grass(plain, 0, 1);
        plain.grid[0][2] = new Grass(plain, 0, 2);
        plain.grid[1][0] = new Grass(plain, 1, 0);
        plain.grid[1][2] = new Grass(plain, 1, 2);
        plain.grid[2][0] = new Grass(plain, 2, 0);
        plain.grid[2][1] = new Grass(plain, 2, 1);
        plain.grid[2][2] = new Grass(plain, 2, 2);
        Living next = rabbit.next(plain);
        assertTrue(next instanceof Rabbit);
    }
}