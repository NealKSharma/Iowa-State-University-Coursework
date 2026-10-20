package hw4;

import api.Cell;
import api.Icon;
import api.Position;

/**
 * Represents a piece that moves in a circular pattern through predefined states.
 * The piece consists of four cells that change positions in a circular sequence.
 * 
 * @author Neal Kaushik Sharma
 */
public class CirclingPiece extends AbstractPiece {
	/**
	 * Current state of the piece in the sequence
	 */
    private int currentState;

    /**
     * Predefined sequence of positions for the cells
     */
    private static final Position[][] sequence = {
    	    {new Position(0, 0), new Position(1, 0), new Position(2, 0), new Position(2, 1)}, // State 0
    	    {new Position(0, 1), new Position(0, 0), new Position(1, 0), new Position(2, 0)}, // State 1
    	    {new Position(0, 2), new Position(0, 1), new Position(0, 0), new Position(1, 0)}, // State 2
    	    {new Position(1, 2), new Position(0, 2), new Position(0, 1), new Position(0, 0)}, // State 3
    	    {new Position(2, 2), new Position(1, 2), new Position(0, 2), new Position(0, 1)}, // State 4
    	    {new Position(2, 1), new Position(2, 2), new Position(1, 2), new Position(0, 2)}, // State 5
    	    {new Position(2, 0), new Position(2, 1), new Position(2, 2), new Position(1, 2)}, // State 6
    	    {new Position(1, 0), new Position(2, 0), new Position(2, 1), new Position(2, 2)}  // State 7
    	};

    /**
     * Constructs a CirclingPiece with the given position and icon array.
     * 
     * @param position the initial position for the upper-left corner of the bounding box
     * @param icons an array of four icons to initialize the piece
     * @throws IllegalArgumentException if the icons array is null or does not contain exactly four icons
     */
    public CirclingPiece(Position position, Icon[] icons) {
        super(position);

        // Validate the icons array
        if (icons == null || icons.length != 4) {
            throw new IllegalArgumentException("Icons array does not contain 4 icons.");
        }

        // Initialize the cells with the given icons and positions from the first state in the sequence
        Cell[] cells = new Cell[4];
        for (int i = 0; i < 4; i++) {
            cells[i] = new Cell(icons[i], sequence[0][i]);
        }
        setCells(cells);
        // Initialize the current state to 0 (the first state in the sequence)
        currentState = 0;
    }

    /**
     * Transforms the CirclingPiece by changing the positions of its cells to the next state in the circular sequence.
     */
    @Override
    public void transform() {
    	
    	// Update the current state by moving to the next position in the sequence
        currentState++;
        if (currentState > 7){
        	currentState = 0;
        }

        // Get the current cells of the piece.
        Cell[] cells = getCells();
        // Create newCells to make it easier to update the position.
        Cell[] newCells = new Cell[4];
        
        // Update the positions of the cells according to the new state in the sequence
        for (int i = 0; i < 4; i++) {
            newCells[i] = new Cell(cells[i].getIcon(), sequence[currentState][i]);
        }
        // Updates the cells with the new positions using setCells method.
        setCells(newCells);
    }
}
