package ui;

import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Random;

import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

import api.DescriptionUtil;
import api.Move;
import hw3.Board;

/**
 * Panel for launching a file dialog and starting a new instance of the Block
 * Slider game.
 * 
 * @author smkautz
 * @author tancreti
 */
public class ButtonPanel extends JPanel {
	/**
	 * Suppress compiler warning.
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Button to initiate file selection.
	 */
	private JButton loadButton;

	/**
	 * Button to reset the board.
	 */
	private JButton resetButton;

	/**
	 * Button to prompt a hint.
	 */
	private JButton hintButton;

	/**
	 * Panel for the associated game. This reference is needed in order to resize
	 * the panel when a new game is selected.
	 */
	private BoardPanel boardPanel;

	/**
	 * Score panel for the associated game. This reference is needed in order to
	 * resize the panel when a new game is selected.
	 */
	private ScorePanel scorePanel;

	/**
	 * Constructs the file selection button panel.
	 * 
	 * @param boardPanel the board panel
	 * @param scorePanel the score panel
	 */
	public ButtonPanel(BoardPanel boardPanel, ScorePanel scorePanel) {
		this.boardPanel = boardPanel;
		this.scorePanel = scorePanel;
		loadButton = new JButton("Load");
		resetButton = new JButton("Reset");
		hintButton = new JButton("Hint");
		this.add(loadButton);
		this.add(resetButton);
		this.add(hintButton);
		loadButton.addActionListener(new ChooseButtonHandler());
		resetButton.addActionListener(new ResetButtonHandler());
		hintButton.addActionListener(new HintButtonHandler());
	}

	private class HintButtonHandler implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent event) {
			Board board = boardPanel.getBoard();
			ArrayList<Move> moves = board.getAllPossibleMoves();
			if (moves.size() > 0) {
				Random rand = new Random();
				int randomMove = rand.nextInt(moves.size());
				JOptionPane.showMessageDialog(null, "Try moving block at " + moves.get(randomMove));
			} else {
				JOptionPane.showMessageDialog(null, "You are stuck!");
			}
		}
	}

	private class ResetButtonHandler implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent event) {
			boardPanel.reset();
		}
	}

	private class ChooseButtonHandler implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent event) {
			// open a file dialog
			JFileChooser chooser = new JFileChooser(System.getProperty("user.home"));
			int result = chooser.showOpenDialog(null);
			String msg = null;
			ArrayList<String[][]> gameDescriptions = null;

			Board board = null;
			if (result == JFileChooser.APPROVE_OPTION) {
				File f = chooser.getSelectedFile();
				try {
					// read the file
					gameDescriptions = DescriptionUtil.readBoardDescriptionsFromFile(f.getAbsolutePath());
					if (gameDescriptions.size() > 0) {
						// there was at least one valid descriptor, create a
						// dialog for selecting which game to play
						ArrayList<String> gameNames = new ArrayList<String>();
						int count = 0;
						for (String[][] g : gameDescriptions) {
							int height = g.length;
							int width = g[0].length;
							String name = count + ": " + height + " x " + width;
							gameNames.add(name);
							count++;
						}
						Object[] possibilities = gameNames.toArray(new String[0]);
						String s = (String) JOptionPane.showInputDialog(null, "Choose your game", "Choose game",
								JOptionPane.PLAIN_MESSAGE, null, possibilities, gameNames.get(0));

						// First part of string should be index of game
						if ((s != null) && (s.length() > 0)) {
							int index = Integer.parseInt(s.substring(0, s.indexOf(":")));
							String[][] desc = gameDescriptions.get(index);
							board = new Board(desc);
						}

						if (board != null) {
							// new game, reset the board panel
							boardPanel.reset(board);

							// ...and resize everything
							int width = board.getColSize();
							int height = board.getRowSize();
							Dimension d = new Dimension(width * GameMain.SIZE, height * GameMain.SIZE);
							boardPanel.setPreferredSize(d);
							d = new Dimension(width * GameMain.SIZE, 3 * GameMain.SIZE);
							scorePanel.setPreferredSize(d);
							d = new Dimension(width * GameMain.SIZE, GameMain.SIZE);
							ButtonPanel.this.setPreferredSize(d);

							// need to reset preferred size of main panel too
							JPanel mainPanel = (JPanel) ButtonPanel.this.getParent();
							int newWindowHeight = boardPanel.getPreferredSize().height
									+ scorePanel.getPreferredSize().height + ButtonPanel.this.getPreferredSize().height;
							int newWindowWidth = boardPanel.getPreferredSize().width;
							mainPanel.setPreferredSize(new Dimension(newWindowWidth, newWindowHeight));

							// now we can resize the window with the pack() method
							JFrame frame = (JFrame) SwingUtilities.getRoot(ButtonPanel.this);
							frame.pack();
							frame.setVisible(true);
							boardPanel.reset(board);
						} else {
							msg = "No valid descriptors in file. ";
						}
					} else {
						msg = "List of descriptors is empty. ";
					}
				} catch (FileNotFoundException ex) {
					msg = ex.toString();
				} catch (Exception e) {
					msg = "Unexpected error: " + e.toString();
				}
			} else {
				msg = "No file selected";
			}

			if (board == null && msg != null) {
				JOptionPane.showMessageDialog(null, msg);
			}
		}
	}
}
