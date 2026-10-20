package hw4;

import api.Cell;
import api.Icon;
import api.Position;
import api.Piece;

/**
 * Represents a piece in the shape of a "Quotes" block. 
 * The piece consists of four cells arranged in a 3x3 grid wihch can undergo transformations.
 * 
 * @author Neal Kaushik Sharma
 */
public class QuotesPiece extends AbstractPiece {
	
	/**
     * Constructs a QuotesPiece with the given position and icon array.
     * 
     * @param position the initial position for the upper-left corner of the bounding box
     * @param icons an array of four icons to initialize the piece
     * @throws IllegalArgumentException if the icons array is null or does not contain exactly four icons
     */
    public QuotesPiece(Position position, Icon[] icons) {
    	
        super(position);
        
        // Validate the icons array
        if (icons == null || icons.length != 4) {
        	throw new IllegalArgumentException("Icons array does not contain 4 icons.");
        }
        
        // Initialize the cells with the given icons and predefined positions
        Cell[] cells = new Cell[4];
        cells[0] = new Cell(icons[0], new Position(0, 0));
        cells[1] = new Cell(icons[1], new Position(1, 0));
        cells[2] = new Cell(icons[2], new Position(0, 2));
        cells[3] = new Cell(icons[3], new Position(1, 2));
        setCells(cells);
    }
    
    /**
     * Transforms the QuotesPiece by rotating the positions of its cells.
     * It changes the positions of the cells in a predefined pattern.
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
            int row = cell.getRow();
            int col = cell.getCol();
            
            // Changes the positions in a predefined pattern.
            if (row == 0 && col == 0) {
                cell.setPosition(new Position(0, 2));
            } else if (row == 0 && col == 1) {
                cell.setPosition(new Position(1, 2));
            } else if (row == 0 && col == 2) {
                cell.setPosition(new Position(2, 2));
            } else if (row == 1 && col == 0) {
                cell.setPosition(new Position(0, 1));
            } else if (row == 1 && col == 2) {
                cell.setPosition(new Position(2, 1));
            } else if (row == 2 && col == 0) {
                cell.setPosition(new Position(0, 0));
            } else if (row == 2 && col == 1) {
                cell.setPosition(new Position(1, 0));
            } else if (row == 2 && col == 2) {
                cell.setPosition(new Position(2, 0));
            }
        }
        // Updates the cells with the new positions using setCells method.
        setCells(newCells);
    }
 }