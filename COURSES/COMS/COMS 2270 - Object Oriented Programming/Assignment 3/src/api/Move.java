package api;

import hw3.Block;

/**
 * Represents moving a block in the Block Slider game.
 * 
 * @author tancreti
 */
public class Move {
	/**
	 * the moved block
	 */
	private Block block;

	/**
	 * the direction the block is moved
	 */
	private Direction direction;

	/**
	 * Constructs a new move for a given block and direction.
	 * 
	 * @param block     the given block
	 * @param direction the given direction
	 */
	public Move(Block block, Direction direction) {
		this.block = block;
		this.direction = direction;
	}

	/**
	 * Returns the moved block.
	 * 
	 * @return the moved block
	 */
	public Block getBlock() {
		return block;
	}

	/**
	 * Returns the moved direction.
	 * 
	 * @return the moved direction
	 */
	public Direction getDirection() {
		return direction;
	}

	@Override
	public String toString() {
		return "(" + block.getFirstRow() + ", " + block.getFirstCol() + ") one cell " + direction;
	}
}
