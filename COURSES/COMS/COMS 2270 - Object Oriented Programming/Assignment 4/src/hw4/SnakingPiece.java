package hw4;

import api.Cell;
import api.Icon;
import api.Position;
import api.Piece;

/**
 * The SnakingPiece class represents a piece that moves in a snaking pattern across a grid.
 * The piece cycles through predefined positions as it moves across the grid.
 * 
 * @author Neal Kaushik Sharma
 */
public class SnakingPiece extends AbstractPiece {

	/** 
     * The sequence of positions that the cells of the SnakingPiece move through in a looping pattern.
     * This sequence defines the snaking movement on the grid.
     */
	private static final Position[] sequence =
		{
		new Position(0, 0),
		new Position(0, 1),
		new Position(0, 2),
		new Position(1, 2),
		new Position(1, 1),
		new Position(1, 0),
		new Position(2, 0),
		new Position(2, 1),
		new Position(2, 2),
		new Position(1, 2),
		new Position(1, 1),
		new Position(1, 0),
		};

	/** 
	 * The counter tracks the current state of the piece as it moves through the sequence. 
	 */
    private int counter;

    /**
     * Constructs a new SnakingPiece at the specified position with the given icons for its cells.
     * The initial configuration is set based on the first four positions of the sequence.
     * 
     * @param position The position of the SnakingPiece.
     * @param icons The icons representing the cells of the SnakingPiece.
     * @throws IllegalArgumentException if the icons array is null or does not contain exactly 4 icons.
     */
    public SnakingPiece(Position position, Icon[] icons) {
        super(position);
        
        // Validate the icons array
        if (icons == null || icons.length != 4) {
            throw new IllegalArgumentException("Icons array does not contain 4 icons.");
        }
        
        Cell[] cells = new Cell[4];
        // Initial positions are (0, 0), (1, 0), (1, 1), and (1, 2)
        cells[0] = new Cell(icons[0], new Position(0, 0)); // Head
        cells[1] = new Cell(icons[1], new Position(1, 0));
        cells[2] = new Cell(icons[2], new Position(1, 1));
        cells[3] = new Cell(icons[3], new Position(1, 2)); // Tail

        setCells(cells);
        
        // Initialize the counter to track the current state of the piece.
        counter = 0;
    }

    /**
     * Transforms the SnakingPiece to the next state in the sequence, adjusting the positions of its cells.
     * The counter is incremented, and the positions of the cells are updated based on the sequence.
     */
    @Override
    public void transform() {
    	// Increment the counter to move to the next state and reset it if it exceeds the number of available states in the sequence.
        counter++;
        if (counter > 11) {
        	counter = 0;
        }
        
        // Get the current cells of the piece.
        Cell[] cells = getCells();
        // Create newCells to make it easier to update the position.
        Cell[] newCells = new Cell[4];
        
        // Update the positions of each cell based on the current state.
        for (int i = 0; i < 4; i++) {
        	// Calculate the index of the next position in the sequence for each cell.
        	int next = (counter - i + 12) % 12;
            newCells[i] = new Cell(cells[i].getIcon(), sequence[next]);
        }
        // Updates the cells with the new positions using setCells method.
        setCells(newCells);
    }
}