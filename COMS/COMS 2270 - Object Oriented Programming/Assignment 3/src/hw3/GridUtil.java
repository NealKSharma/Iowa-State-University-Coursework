package hw3;

import static api.Orientation.*;
import static api.CellType.*;

import java.util.ArrayList;

import api.Cell;

/**
 * Utilities for parsing string descriptions of a grid.
 * 
 * @author Neal Kaushik Sharma
 */
public class GridUtil {
	/**
	 * Constructs a 2D grid of Cell objects given a 2D array of cell descriptions.
	 * String descriptions are a single character and have the following meaning.
	 * <ul>
	 * <li>"*" represents a wall.</li>
	 * <li>"e" represents an exit.</li>
	 * <li>"." represents a floor.</li>
	 * <li>"[", "]", "^", "v", or "#" represent a part of a block. A block is not a
	 * type of cell, it is something placed on a cell floor. For these descriptions
	 * a cell is created with CellType of FLOOR. This method does not create any
	 * blocks or set blocks on cells.</li>
	 * </ul>
	 * The method only creates cells and not blocks. See the other utility method
	 * findBlocks which is used to create the blocks.
	 * 
	 * @param desc a 2D array of strings describing the grid
	 * @return a 2D array of cells the represent the grid without any blocks present
	 */
	public static Cell[][] createGrid(String[][] desc) {
	    Cell[][] cellGrid = new Cell[desc.length][desc[0].length];
	    
	    // Loop through each element in the desc array
	    for (int i = 0; i < desc.length; i++) {
	        for (int j = 0; j < desc[i].length; j++) {
	            String symbol = desc[i][j];
	            
	            // Determine the type of cell based on the symbol in the description
	            if (symbol.equals("[") || symbol.equals("]") || 
	                symbol.equals("^") || symbol.equals("v") || 
	                symbol.equals("#")) {
	                cellGrid[i][j] = new Cell(FLOOR, i, j); // Set as floor
	            }
	            else if (symbol.equals("*")) {
	                cellGrid[i][j] = new Cell(WALL, i, j); // Set as wall
	            }
	            else if (symbol.equals("e")) {
	                cellGrid[i][j] = new Cell(EXIT, i, j); // Set as exit
	            }
	            else {
	                cellGrid[i][j] = new Cell(FLOOR, i, j); // Default to floor
	            }
	        }
	    }
	    // Return the created grid
	    return cellGrid;
	}

	/**
	 * Returns a list of blocks that are constructed from a given 2D array of cell
	 * descriptions. String descriptions are a single character and have the
	 * following meanings.
	 * <ul>
	 * <li>"[" the start (left most column) of a horizontal block</li>
	 * <li>"]" the end (right most column) of a horizontal block</li>
	 * <li>"^" the start (top most row) of a vertical block</li>
	 * <li>"v" the end (bottom most column) of a vertical block</li>
	 * <li>"#" inner segments of a block, these are always placed between the start
	 * and end of the block</li>
	 * <li>"*", ".", and "e" symbols that describe cell types, meaning there is not
	 * block currently over the cell</li>
	 * </ul>
	 * 
	 * @param desc a 2D array of strings describing the grid
	 * @return a list of blocks found in the given grid description
	 */
	public static ArrayList<Block> findBlocks(String[][] desc) {
	    ArrayList<Block> blocks = new ArrayList<>();
	    
	    // Find horizontal blocks
	    for (int i = 0; i < desc.length; i++) {
	        for (int j = 0; j < desc[0].length; j++) {
	            if (desc[i][j].equals("[")) {
	                int firstCol = j;
	                int length = 0;
	                
	                // Count length until we find the end bracket
	                while (j < desc[i].length && !desc[i][j].equals("]")) {
	                    length++;
	                    j++;
	                }
	                if (j < desc[i].length && desc[i][j].equals("]")) {
	                    // Add 1 for the end bracket
	                    length++;
	                    Block block = new Block(i, firstCol, length, HORIZONTAL);
	                    blocks.add(block);
	                }
	            }
	        }
	    }
	    
	    // Find vertical blocks
	    for (int j = 0; j < desc[0].length; j++) {
	        for (int i = 0; i < desc.length; i++) {
	            if (desc[i][j].equals("^")) {
	                int firstRow = i;
	                int length = 0;
	                
	                // Count length until we find the bottom marker
	                while (i < desc.length && !desc[i][j].equals("v")) {
	                    length++;
	                    i++;
	                }
	                if (i < desc.length && desc[i][j].equals("v")) {
	                    // Add 1 for the bottom marker
	                    length++;
	                    Block block = new Block(firstRow, j, length, VERTICAL);
	                    blocks.add(block);
	                }
	            }
	        }
	    }
	    
	    return blocks;
	}
}