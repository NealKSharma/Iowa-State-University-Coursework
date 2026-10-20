package edu.iastate.cs2280.hw1;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

public class AnimalTest {
    private Plain plain;
    private TestAnimal animal;

    // Test class for Animal.
    private class TestAnimal extends Animal {
        public TestAnimal(Plain p, int r, int c, int a) {
            super(p, r, c, a);
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

    @Before
    public void setUp() {
        plain = new Plain(3);
        animal = new TestAnimal(plain, 1, 1, 2);
    }

    @Test
    public void testConstructor() {
        assertEquals(plain, animal.plain);
        assertEquals(1, animal.row);
        assertEquals(1, animal.column);
        assertEquals(2, animal.age);
    }

    @Test
    public void testMyAge() {
        assertEquals(2, animal.myAge());
    }

    @Test
    public void testWho() {
        assertEquals(State.EMPTY, animal.who());
    }

    @Test
    public void testNext() {
        Living next = animal.next(plain);
        assertTrue(next instanceof Empty);
    }
}