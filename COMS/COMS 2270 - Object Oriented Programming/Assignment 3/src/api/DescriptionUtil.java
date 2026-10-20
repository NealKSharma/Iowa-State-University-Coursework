package api;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

/**
 * Utilities for reading board position descriptions from a file.
 * 
 * @author smkautz
 * @author tancreti
 */
public class DescriptionUtil {
	/**
	 * Reads a the given file and creates a list of 2D string arrays from each block
	 * of text separated by whitespace. Each element of the list represent a
	 * starting board position for the game. The starting positions are string
	 * descriptions that indicate the cell type or the presence of a block in a
	 * cell. Despite the name of this method, it does NO checking for whether a
	 * given block of text actually represents a valid board position for the game.
	 * The file is assumed to end with a blank line. See games.txt as an example
	 * file that can be read by the method.
	 * 
	 * @param absolutePath the path to the file
	 * @return a list of board position descriptions
	 * @throws FileNotFoundException file not found
	 */
	public static ArrayList<String[][]> readBoardDescriptionsFromFile(String absolutePath)
			throws FileNotFoundException {
		ArrayList<String[][]> positions = new ArrayList<String[][]>();
		File file = new File(absolutePath);
		Scanner scnr = new Scanner(file);
		while (scnr.hasNextLine()) {
			positions.add(readBoardDescriptionFromScanner(scnr));
		}
		scnr.close();
		return positions;
	}

	/**
	 * Reads a single board position description for a scanner and converts it into
	 * a 2D array of strings.
	 * 
	 * @param scnr the scanner to read from
	 * @return a 2D array of strings describing a board position
	 */
	public static String[][] readBoardDescriptionFromScanner(Scanner scnr) {
		ArrayList<String[]> lines = new ArrayList<String[]>();
		while (scnr.hasNextLine()) {
			String line = scnr.nextLine();
			if (!line.trim().equals("")) {
				String[] positions = readBoardPositionLine(line);
				lines.add(positions);
			} else {
				break;
			}
		}
		return lines.toArray(new String[0][0]);
	}

	/**
	 * Helper method to read a single line of board position description text.
	 * 
	 * @param line the text to read
	 * @return an array of strings representing a single row of cells on a board
	 */
	private static String[] readBoardPositionLine(String line) {
		Scanner scnr = new Scanner(line);
		ArrayList<String> squares = new ArrayList<String>();
		while (scnr.hasNext()) {
			squares.add(scnr.next());
		}
		scnr.close();
		return squares.toArray(new String[0]);
	}
}
