package ui;

import java.awt.Color;
import java.awt.Graphics;

import javax.swing.JPanel;

import api.Cell;
import api.Icon;
import api.Piece;

/**
 * Panel for displaying a preview of a block in a Tetris-style game.
 */
public class PreviewPanel extends JPanel
{
  private Piece nextPiece;
  
  /**
   * Sets the preview of the next piece for this panel.
   * @param piece
   *   the next piece to be displayed
   */
  public void updatePiece(Piece piece)
  {
    this.nextPiece = piece;
    repaint();
  }
  
  @Override
  public void paintComponent(Graphics g)
  {
    // clear background
    g.setColor(GameMain.BACKGROUND_COLOR);
    g.fillRect(0, 0, getWidth(), getHeight());

    // paint occupied cells of the next piece
    if (nextPiece != null)
    {
      Cell[] cells = nextPiece.getCells();
      for (Cell c : cells)
      {
        int row = c.getRow();
        int col = c.getCol();
        if (row < 3 && col < 3)
        {
          paintOneCell(g, row, col, c.getIcon());
        }
      }
    }
  }
  
  private void paintOneCell(Graphics g, int row, int col, Icon t)
  {
    // scale everything up by the SIZE
    int x = GameMain.SIZE * col;
    int y = GameMain.SIZE * row;
    g.setColor(t.getColorHint());
    g.fillRect(x, y, GameMain.SIZE, GameMain.SIZE);
    g.setColor(Color.GRAY);
    g.drawRect(x, y, GameMain.SIZE - 1, GameMain.SIZE - 1);
  }
}
