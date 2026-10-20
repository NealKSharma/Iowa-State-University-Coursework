package hw3;

import api.Direction;
import api.Orientation;

/**
 * Represents a block in the Block Slider game.
 * 
 * @author Neal Kaushik Sharma
 */
public class Block {
	/**
	 * The row index of the first cell that this block occupies.
	 */
	private int firstRow;

	/**
	 * The column index of the first cell that this block occupies.
	 */
	private int firstCol;

	/**
	 * The length of the block, representing how many cells it spans in its orientation.
	 */
	private int length;

	/**
	 * The original row index of the first cell that this block occupied before any movements.
	 */
	private int originalFirstRow;

	/**
	 * The original column index of the first cell that this block occupied before any movements.
	 */
	private int originalFirstCol;

	/**
	 * The orientation of the block, which determines whether the block is placed horizontally or vertically.
	 */
	private Orientation orientation;


	/**
	 * Constructs a new Block with a specific location relative to the board. The
	 * upper/left most corner of the block is given as firstRow and firstCol. All
	 * blocks are only one cell wide. The length of the block is specified in cells.
	 * The block can either be horizontal or vertical on the board as specified by
	 * orientation.
	 * 
	 * @param firstRow    the first row that contains the block
	 * @param firstCol    the first column that contains the block
	 * @param length      block length in cells
	 * @param orientation either HORIZONTAL or VERTICAL
	 */
	public Block(int firstRow, int firstCol, int length, Orientation orientation) {
		// Initialize the block's current position and size
		this.firstRow = firstRow;
		this.firstCol = firstCol;
		this.length = length;
		this.orientation = orientation;
		
		// Save the original position of the block
		this.originalFirstRow = firstRow;
		this.originalFirstCol = firstCol;
	}

	/**
	 * Resets the position of the block to the original firstRow and firstCol values
	 * that were passed to the constructor during initialization of the the block.
	 */
	public void reset() {
		firstRow = originalFirstRow;
		firstCol = originalFirstCol;
	}

	/**
	 * Move the blocks position by one cell in the direction specified. The blocks
	 * first column and row should be updated. The method will only move VERTICAL
	 * blocks UP or DOWN and HORIZONTAL blocks RIGHT or LEFT. Invalid movements are
	 * ignored.
	 * 
	 * @param dir direction to move (UP, DOWN, RIGHT, or LEFT)
	 */
	public void move(Direction dir) {
	    // If the block is oriented vertically, adjust its row position
	    if (orientation == Orientation.VERTICAL) {
	        if (dir == Direction.UP) firstRow--; // Move up (decrease row)
	        else if (dir == Direction.DOWN) firstRow++; // Move down (increase row)
	    }
	    // If the block is oriented horizontally, adjust its column position
	    else if (orientation == Orientation.HORIZONTAL) {
	        if (dir == Direction.LEFT) firstCol--; // Move left (decrease column)
	        else if (dir == Direction.RIGHT) firstCol++; // Move right (increase column)
	    }
	}

	/**
	 * Gets the first row of the block on the board.
	 * 
	 * @return first row
	 */
	public int getFirstRow() {
		return firstRow;
	}

	/**
	 * Sets the first row of the block on the board.
	 * 
	 * @param firstRow first row
	 */
	public void setFirstRow(int firstRow) {
		this.firstRow = firstRow;
	}

	/**
	 * Gets the first column of the block on the board.
	 * 
	 * @return first column
	 */
	public int getFirstCol() {
		return firstCol;
	}

	/**
	 * Sets the first column of the block on the board.
	 * 
	 * @param firstCol first column
	 */
	public void setFirstCol(int firstCol) {
		this.firstCol = firstCol;
	}

	/**
	 * Gets the length of the block.
	 * 
	 * @return length measured in cells
	 */
	public int getLength() {
		return length;
	}

	/**
	 * Gets the orientation of the block.
	 * 
	 * @return either VERTICAL or HORIZONTAL
	 */
	public Orientation getOrientation() {
		return orientation;
	}

	@Override
	public String toString() {
		return "(row=" + getFirstRow() + ", col=" + getFirstCol() + ", len=" + getLength()
				+ ", ori=" + getOrientation() + ")";
	}
}
