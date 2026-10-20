package hw3;

import static api.Direction.*;

import java.util.ArrayList;

import api.Cell;
import api.Direction;
import api.Move;
import api.Orientation;

/**
 * Represents a board in the Block Slider game. A board contains a 2D grid of
 * cells and a list of blocks that slide over the cells.
 * 
 * @author Neal Kaushik Sharma
 */
public class Board {
	/**
	 * 2D array of cells, the indexes signify (row, column) with (0, 0) representing
	 * the upper-left corner of the board.
	 */
	private Cell[][] grid;

	/**
	 * A list of blocks that are positioned on the board.
	 */
	private ArrayList<Block> blocks;

	/**
	 * A list of moves that have been made in order to get to the current position
	 * of blocks on the board.
	 */
	private ArrayList<Move> moveHistory;
	private Block grabbedBlock; // To store the currently grabbed block
	private Cell grabbedCell;   // To store the cell where the block was grabbed

	/**
	 * Constructs a new board from a given 2D array of cells and list of blocks. The
	 * cells of the grid should be updated to indicate which cells have blocks
	 * placed over them (i.e., setBlock() method of Cell). The move history should
	 * be initialized as empty.
	 * 
	 * @param grid   a 2D array of cells which is expected to be a rectangular shape
	 * @param blocks list of blocks already containing row-column position which
	 *               should be placed on the board
	 */
	public Board(Cell[][] grid, ArrayList<Block> blocks) {
	    this.grid = grid;
	    this.blocks = blocks;
	    moveHistory = new ArrayList<Move>();
	    
	    // Clear existing blocks from all cells
	    for (Cell[] row : grid) {
	        for (Cell cell : row) {
	            cell.setBlock(null); // Removing block from the cell
	        }
	    }

	    // Place each block on the grid based on its orientation and position
	    for (Block block : blocks) {
	        for (int i = 0; i < block.getLength(); i++) {
	            int row = block.getFirstRow();
	            int col = block.getFirstCol();
	            
	            if (block.getOrientation() == Orientation.HORIZONTAL) grid[row][col + i].setBlock(block); // Place block horizontally
	            else grid[row + i][col].setBlock(block); // Place block vertically
	        }
	    }
	}

	/**
	 * Constructs a new board from a given 2D array of String descriptions.
	 * <p>
	 * DO NOT MODIFY THIS CONSTRUCTOR
	 * 
	 * @param desc 2D array of descriptions
	 */
	public Board(String[][] desc) {
		this(GridUtil.createGrid(desc), GridUtil.findBlocks(desc));
	}

	/**
	 * Models the user grabbing a block over the given row and column. The purpose
	 * of grabbing a block is for the user to be able to drag the block to a new
	 * position, which is performed by calling moveGrabbedBlock(). This method
	 * records two things: the block that has been grabbed and the cell at which it
	 * was grabbed.
	 * 
	 * @param row row to grab the block from
	 * @param col column to grab the block from
	 */
	public void grabBlockAtCell(int row, int col) {
	    // Check if the position is within grid bounds
	    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
	        // Get the cell at the specified position
	        Cell cell = grid[row][col];
	        
	        // If the cell contains a block, grab the block and set the grabbed cell
	        if (cell != null && cell.hasBlock()) {
	            grabbedBlock = cell.getBlock();
	        }
	        
	        // Set the grabbed cell to the specified cell
	        grabbedCell = cell;
	    }
	}

	/**
	 * Set the currently grabbed block to null.
	 */
	public void releaseBlock() {
		grabbedBlock = null;
	    grabbedCell = null;
	}

	/**
	 * Returns the currently grabbed block.
	 * 
	 * @return the current block
	 */
	public Block getGrabbedBlock() {
		return grabbedBlock;
	}

	/**
	 * Returns the currently grabbed cell.
	 * 
	 * @return the current cell
	 */
	public Cell getGrabbedCell() {
		return grabbedCell;
	}

	/**
	 * Returns true if the cell at the given row and column is available for a block
	 * to be placed over it. Blocks can only be placed over floors and exits. A
	 * block cannot be placed over a cell that is occupied by another block.
	 * 
	 * @param row row location of the cell
	 * @param col column location of the cell
	 * @return true if the cell is available for a block, otherwise false
	 */
	public boolean canPlaceBlock(int row, int col) {
	    // Check if the position is within grid bounds
	    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
	        return false;
	    }

	    // Get the cell at the specified position
	    Cell cell = grid[row][col];

	    // Ensure the cell is either a floor or an exit and is not already occupied by a block
	    return (cell.isFloor() || cell.isExit()) && cell.getBlock() == null;
	}


	/**
	 * Returns the number of moves made so far in the game.
	 * 
	 * @return the number of moves
	 */
	public int getMoveCount() {
		return moveHistory.size();
	}

	/**
	 * Returns the number of rows of the board.
	 * 
	 * @return number of rows
	 */
	public int getRowSize() {
		return grid.length;
	}

	/**
	 * Returns the number of columns of the board.
	 * 
	 * @return number of columns
	 */
	public int getColSize() {
		return grid[0].length;
	}

	/**
	 * Returns the cell located at a given row and column.
	 * 
	 * @param row the given row
	 * @param col the given column
	 * @return the cell at the specified location
	 */
	public Cell getCell(int row, int col) {
		 if (isWithinBounds(row, col)) {
		        return grid[row][col];
		    }
		    return null;
	}

	/**
	 * Returns a list of all blocks on the board.
	 * 
	 * @return a list of all blocks
	 */
	public ArrayList<Block> getBlocks() {
		return blocks;
	}

	/**
	 * Returns true if the player has completed the puzzle by positioning a block
	 * over an exit, false otherwise.
	 * 
	 * @return true if the game is over
	 */
	public boolean isGameOver() {
	    for (Block block : blocks) {
	        int row = block.getFirstRow();
	        int col = block.getFirstCol();
	        int length = block.getLength();
	        Orientation orientation = block.getOrientation();

	        // Check if any cell of the block is over an exit
	        for (int i = 0; i < length; i++) {
	            int checkRow = row + (orientation == Orientation.VERTICAL ? i : 0);
	            int checkCol = col + (orientation == Orientation.HORIZONTAL ? i : 0);
	            
	            if (grid[checkRow][checkCol].isExit()) {
	                return true;
	            }
	        }
	    }
	    return false;
	}

	/**
	 * Moves the currently grabbed block by one cell in the given direction. A
	 * horizontal block is only allowed to move right and left and a vertical block
	 * is only allowed to move up and down. A block can only move over a cell that
	 * is a floor or exit and is not already occupied by another block. The method
	 * does nothing under any of the following conditions:
	 * <ul>
	 * <li>The game is over.</li>
	 * <li>No block is currently grabbed by the user.</li>
	 * <li>A block is currently grabbed by the user, but the block is not allowed to
	 * move in the given direction.</li>
	 * </ul>
	 * If none of the above conditions are meet, the method does the following:
	 * <ul>
	 * <li>Moves the block object by calling its move method.</li>
	 * <li>Sets the block for the grid cell that the block is being moved into.</li>
	 * <li>For the grid cell that the block is being moved out of, sets the block to
	 * null.</li>
	 * <li>Moves the currently grabbed cell by one cell in the same moved direction.
	 * The purpose of this is to make the currently grabbed cell move with the block
	 * as it is being dragged by the user.</li>
	 * <li>Adds the move to the end of the moveHistory list.</li>
	 * <li>Increment the count of total moves made in the game.</li>
	 * </ul>
	 * 
	 * @param dir the direction to move
	 */
	public void moveGrabbedBlock(Direction dir) {
		// Return if the game is over or if there is no block currently grabbed
	    if (isGameOver() || grabbedBlock == null) {
	        return;
	    }
	    
	    // Block's orientation restricts its movement direction
	    if ((grabbedBlock.getOrientation() == Orientation.HORIZONTAL && (dir == UP || dir == DOWN)) ||
	        (grabbedBlock.getOrientation() == Orientation.VERTICAL && (dir == LEFT || dir == RIGHT))) {
	        return;
	    }

	    // Get the current position and dimensions of the grabbed block
	    int firstRow = grabbedBlock.getFirstRow();
	    int firstCol = grabbedBlock.getFirstCol();
	    int length = grabbedBlock.getLength();

	    // Initialize new row and column values based on the direction of movement
	    int newRow = firstRow;
	    int newCol = firstCol;
	    
	    // Update row or column based on direction
	    if (dir == UP) newRow -= 1;
	    else if (dir == DOWN) newRow += 1;
	    else if (dir == LEFT) newCol -= 1;
	    else if (dir == RIGHT) newCol += 1;

	    // Check if the target cells for the block's new position are within bounds and free (no obstacles)
	    for (int i = 0; i < length; i++) {
	        int targetRow = newRow + (grabbedBlock.getOrientation() == Orientation.VERTICAL ? i : 0);
	        int targetCol = newCol + (grabbedBlock.getOrientation() == Orientation.HORIZONTAL ? i : 0);

	        // If any target cell is out of bounds, return and don't move the block
	        if (!isWithinBounds(targetRow, targetCol)) {
	            return;
	        }

	        Cell targetCell = grid[targetRow][targetCol];
	        // If the target cell is neither a floor nor an exit, return and don't move the block
	        if (!(targetCell.isFloor() || targetCell.isExit())) {
	            return;
	        }
	    }

	    // Checks to make sure that there's already isn't a block where we are trying to move the block.
	    if (dir == RIGHT || dir == DOWN) {
	        int endRow = newRow + (grabbedBlock.getOrientation() == Orientation.VERTICAL ? length - 1 : 0);
	        int endCol = newCol + (grabbedBlock.getOrientation() == Orientation.HORIZONTAL ? length - 1 : 0);

	        // If the target space is not free, return without moving
	        if (!canPlaceBlock(endRow, endCol)) {
	            return;
	        }
	    } else if (dir == LEFT || dir == UP) {
	        int startRow = newRow + (grabbedBlock.getOrientation() == Orientation.VERTICAL ? 0 : 0);
	        int startCol = newCol + (grabbedBlock.getOrientation() == Orientation.HORIZONTAL ? 0 : 0);

	        // If the target space is not free, return without moving
	        if (!canPlaceBlock(startRow, startCol)) {
	            return;
	        }
	    }
	    
	    // Clear the block from its old position on the grid
	    for (int i = 0; i < length; i++) {
	        int oldRow = firstRow + (grabbedBlock.getOrientation() == Orientation.VERTICAL ? i : 0);
	        int oldCol = firstCol + (grabbedBlock.getOrientation() == Orientation.HORIZONTAL ? i : 0);
	        grid[oldRow][oldCol].clearBlock(); // Clear the block from the old cells
	    }

	    // Move the grabbed block to the new position
	    grabbedBlock.move(dir);

	    // Set the block in its new position on the grid
	    for (int i = 0; i < length; i++) {
	        int newBlockRow = newRow + (grabbedBlock.getOrientation() == Orientation.VERTICAL ? i : 0);
	        int newBlockCol = newCol + (grabbedBlock.getOrientation() == Orientation.HORIZONTAL ? i : 0);
	        grid[newBlockRow][newBlockCol].setBlock(grabbedBlock); // Place the block in its new cells
	    } 
	    // Update the grabbed cell reference to the new position
	    grabbedCell = grid[newRow][newCol];
	    // Add the move to the history for undo functionality
	    moveHistory.add(new Move(grabbedBlock, dir));
	}

	/**
	 * Private method used to make it easier to check if the given row and column values are in bounds of the grid.
	 * @param row
	 * @param col
	 * @return true if the values are within bounds otherwise returns false
	 */
	private boolean isWithinBounds(int row, int col) {
	    return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
	}

	/**
	 * Resets the state of the game back to the start, which includes the move
	 * count, the move history, and whether the game is over. The method calls the
	 * reset method of each block object. It also updates each grid cells by calling
	 * their setBlock method to either set a block if one is located over the cell
	 * or set null if no block is located over the cell.
	 */
	/**
	 * Resets the game state to its initial configuration.
	 * This includes clearing move history, resetting blocks, and updating the grid.
	 */
	public void reset() {
	    // Clear move history and reset grabbed block and cell
	    moveHistory.clear();
	    grabbedBlock = null;
	    grabbedCell = null;

	    // Reset each block's state
	    for (Block block : blocks) {
	        block.reset();
	    }

	    // Clear all blocks from the grid
	    for (Cell[] row : grid) {
	        for (Cell cell : row) {
	            cell.clearBlock();
	        }
	    }

	    // Re-position all blocks on the grid based on their initial positions
	    for (Block block : blocks) {
	        for (int i = 0; i < block.getLength(); i++) {
	            int row = block.getFirstRow();
	            int col = block.getFirstCol();
	            
	            // Place the block on the correct cells based on its orientation
	            if (block.getOrientation() == Orientation.HORIZONTAL) {
	                grid[row][col + i].setBlock(block);
	            } else {
	                grid[row + i][col].setBlock(block);
	            }
	        }
	    }
	}


	/**
	 * Returns a list of all legal moves that can be made by any block on the
	 * current board. If the game is over there are no legal moves.
	 * 
	 * @return a list of legal moves
	 */
	public ArrayList<Move> getAllPossibleMoves() {
	    ArrayList<Move> possibleMoves = new ArrayList<>();
	    
	    // If the game is over, no moves can be made
	    if (isGameOver()) {
	        return possibleMoves;
	    }
	    // Loops through block and checks each direction
	    for (Block block : blocks) {
	        for (Direction dir : Direction.values()) {
	            int firstRow = block.getFirstRow();
	            int firstCol = block.getFirstCol();
	            int length = block.getLength();
	            boolean canMove = true;
	            
	            // Skip invalid directions based on block's orientation
	            if ((block.getOrientation() == Orientation.HORIZONTAL && (dir == UP || dir == DOWN)) ||
	                (block.getOrientation() == Orientation.VERTICAL && (dir == LEFT || dir == RIGHT))) {
	                continue;
	            }
	            
	            // Check if the block can move in the selected direction
	            for (int i = 0; i < length; i++) {
	                int targetRow = firstRow + (block.getOrientation() == Orientation.VERTICAL ? i : 0);
	                int targetCol = firstCol + (block.getOrientation() == Orientation.HORIZONTAL ? i : 0);

	                if (dir == UP) targetRow -= 1;
	                else if (dir == DOWN) targetRow += 1;
	                else if (dir == LEFT) targetCol -= 1;
	                else if (dir == RIGHT) targetCol += 1;
	                
	                // Check if the move is within bounds and not blocked
	                if (!isWithinBounds(targetRow, targetCol)) {
	                    canMove = false;
	                    break;
	                }

	                Cell targetCell = grid[targetRow][targetCol];
	                if (!(targetCell.isFloor() || targetCell.isExit())) {
	                    canMove = false;
	                    break;
	                }
	            }
	            // If the move is valid, add it to the list
	            if (canMove) {
	                possibleMoves.add(new Move(block, dir));
	            }
	        }
	    }

	    return possibleMoves;
	}

	/**
	 * Gets the list of all moves performed to get to the current position on the
	 * board.
	 * 
	 * @return a list of moves performed to get to the current position
	 */
	public ArrayList<Move> getMoveHistory() {
	    return new ArrayList<>(moveHistory);
	}

	/**
	 * EXTRA CREDIT 5 POINTS
	 * <p>
	 * This method is only used by the Solver.
	 * <p>
	 * Undo the previous move. The method gets the last move on the moveHistory list
	 * and performs the opposite actions of that move, which are the following:
	 * <ul>
	 * <li>grabs the moved block and calls moveGrabbedBlock passing the opposite
	 * direction</li>
	 * <li>decreases the total move count by two to undo the effect of calling
	 * moveGrabbedBlock twice</li>
	 * <li>if required, sets is game over to false</li>
	 * <li>removes the move from the moveHistory list</li>
	 * </ul>
	 * If the moveHistory list is empty this method does nothing.
	 */
	public void undoMove() {
		// If there are no moves in history, do nothing
	    if (moveHistory.isEmpty()) return;
	    
	    // Get the last move from the history
	    Move lastMove = moveHistory.remove(moveHistory.size() - 1);
	    
	    // Set the grabbed block and cell based on the last move
	    grabbedBlock = lastMove.getBlock();
	    grabbedCell = grid[grabbedBlock.getFirstRow()][grabbedBlock.getFirstCol()];
	    
	    // Determine the opposite direction for undoing the move
	    Direction undoDirection;
	    if (lastMove.getDirection() == Direction.UP) undoDirection = Direction.DOWN;
	    else if (lastMove.getDirection() == Direction.DOWN) undoDirection = Direction.UP;
	    else if (lastMove.getDirection() == Direction.LEFT) undoDirection = Direction.RIGHT;
	    else undoDirection = Direction.LEFT;
	    
	    // Perform the move in the opposite direction
	    moveGrabbedBlock(undoDirection);
	    
	    // Remove the move from history
	    if (!moveHistory.isEmpty()) {
	        moveHistory.remove(moveHistory.size() - 1);
	    }
	}

	@Override
	public String toString() {
		StringBuffer buff = new StringBuffer();
		boolean first = true;
		for (Cell row[] : grid) {
			if (!first) {
				buff.append("\n");
			} else {
				first = false;
			}
			for (Cell cell : row) {
				buff.append(cell.toString());
				buff.append(" ");
			}
		}
		return buff.toString();
	}
}