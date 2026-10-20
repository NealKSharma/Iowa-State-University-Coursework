package api;

import static api.CellType.*;

import hw3.Block;

/**
 * Class representing one cell in a 2D grid for a Block Slider game. A cell may
 * represent a WALL, FLOOR, or EXIT as represented by the CellType attribute.
 * After construction, the type cannot be directly examined or manipulated;
 * instead, clients use the accessor methods such as isWall or isFloor.
 * <p>
 * In addition to the cell type, a cell may contain a block. This is only
 * possible for cells that are floors (or the exit). See methods setBlock,
 * getBlock, and clearBlock.
 *
 * @author smkautz
 * @author tancreti
 */
public class Cell {
	/**
	 * a block that is located over the cell or null if none
	 */
	private Block block;

	/**
	 * the cell type
	 */
	private CellType type;

	/**
	 * the column location of the cell in the grid
	 */
	private int col;

	/**
	 * the row location of the cell in the grid
	 */
	private int row;

	/**
	 * Constructs an cell with a given type and location in the grid
	 * 
	 * @param type the given type
	 * @param row  the row location of the cell
	 * @param col  the column location of the cell
	 */
	public Cell(CellType type, int row, int col) {
		this.type = type;
		this.row = row;
		this.col = col;
	}

	/**
	 * Determines whether this cell is a wall.
	 * 
	 * @return true if this cell is a wall, false otherwise
	 */
	public boolean isWall() {
		return type == WALL;
	}

	/**
	 * Determines whether this cell is a floor.
	 * 
	 * @return true if this cell is a floor, false otherwise
	 */
	public boolean isFloor() {
		return type == FLOOR;
	}

	/**
	 * Determines whether this cell is an exit.
	 * 
	 * @return true if this cell is an exit, false otherwise
	 */
	public boolean isExit() {
		return type == EXIT;
	}

	/**
	 * Determines whether a block is located over this cell
	 * 
	 * @return true if a block is located over this cell, false otherwise
	 */
	public boolean hasBlock() {
		return block != null;
	}

	/**
	 * Returns the block located over this cell.
	 * 
	 * @return the block located over this cell or null if none
	 */
	public Block getBlock() {
		return block;
	}

	/**
	 * Sets the block for this cell to null.
	 */
	public void clearBlock() {
		block = null;
	}

	/**
	 * Sets the block for this cell to the given object.
	 * 
	 * @param block the block to set
	 */
	public void setBlock(Block block) {
		this.block = block;
	}

	/**
	 * Gets the column location of the cell.
	 * 
	 * @return the column location of the cell
	 */
	public int getCol() {
		return col;
	}

	/**
	 * Gets the row location of the cell.
	 * 
	 * @return the row location of the cell
	 */
	public int getRow() {
		return row;
	}

	@Override
	public String toString() {
		if (isWall()) {
			return "*";
		}
		if (isExit()) {
			return "e";
		}
		if (hasBlock()) {
			if (block.getOrientation() == Orientation.HORIZONTAL) {
				if (col == block.getFirstCol()) {
					return "[";
				}
				if (col == block.getFirstCol() + block.getLength() - 1) {
					return "]";
				}
			} else {
				if (row == block.getFirstRow()) {
					return "^";
				}
				if (row == block.getFirstRow() + block.getLength() - 1) {
					return "v";
				}
			}
			return "#";
		}
		return ".";
	}
}
