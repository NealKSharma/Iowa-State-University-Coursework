package hw4;

import api.Cell;
import api.Icon;
import api.Position;
import api.Piece;

/**
 * Represents a piece in the shape of a "T" block.
 * The piece consists of four cells arranged in a 3x3 grid wihch can undergo transformations.
 * 
 * @author Neal Kaushik Sharma
 */
public class TeePiece extends AbstractPiece {

	/**
     * Constructs a TeePiece with the given position and icon array.
     * 
     * @param position the initial position for the upper-left corner of the bounding box
     * @param icons an array of four icons to initialize the piece
     * @throws IllegalArgumentException if the icons array is null or does not contain exactly four icons
     */
    public TeePiece(Position position, Icon[] icons) {
    	
        super(position);
        
        // Validate the icons array
        if (icons == null || icons.length != 4) {
        	throw new IllegalArgumentException("Icons array does not contain 4 icons.");
        }
        
        // Initialize the cells with the given icons and predefined positions
        Cell[] cells = new Cell[4];
        cells[0] = new Cell(icons[0], new Position(0, 0));
        cells[1] = new Cell(icons[1], new Position(1, 0));
        cells[2] = new Cell(icons[2], new Position(1, 1));
        cells[3] = new Cell(icons[3], new Position(2, 0));
        setCells(cells);
    }

    /**
     * Transforms the TeePiece by changing the positions of its cells.
     * It modifies the columns of the cells, alternating between column 0 and column 2.
     */
    @Override
    public void transform() {
    	
    	// Get the current cells of the piece.
	    Cell[] cells = getCells();
	    // Create newCells to make it easier to update the position.
	    Cell[] newCells = new Cell[cells.length];

	    // Copy the cells to the new array
	    for (int i = 0; i < cells.length; i++) {
	        newCells[i] = new Cell(cells[i]);
	    }

	    // Update the positions for each cell
	    for (Cell cell : newCells) {
	    	// If the column is 0 change it to 2 and vice-versa
	        if (cell.getCol() == 0) {
	            cell.setCol(2);
	        } else if (cell.getCol() == 2) {
	            cell.setCol(0);
	        }
	    }
	    // Updates the cells with the new positions using setCells method.
	    setCells(newCells);
	}
}