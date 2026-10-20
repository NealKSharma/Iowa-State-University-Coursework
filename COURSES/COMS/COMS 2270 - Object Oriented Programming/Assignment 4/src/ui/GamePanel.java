package ui;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.List;

import javax.swing.JPanel;
import javax.swing.Timer;

import api.Cell;
import api.Game;
import api.GameStatus;
import api.Icon;
import api.Piece;
import api.Position;

/**
 * User interface for the main grid of a Tetris-like game.
 */
public class GamePanel extends JPanel
{
  /**
   * The javax.swing.Timer instance used to animate the UI.
   */
  private Timer timer;

  /**
   * The IGame instance for which this is the UI.
   */
  private Game game;
  
  /**
   * Score panel associated with the game.
   */
  private ScorePanel scorePanel;
  
  /**
   * Preview panel associated with the game.
   */
  private PreviewPanel previewPanel;
  
  /**
   * State variable indicating when the timer frequency is increased
   * for dropping a polyomino to the bottom of the grid.
   */
  private boolean fastDrop;
  
  /**
   * State variable counts down to zero while animating 
   * the cells to be collapsed.
   */
  private int animationState = 0;
  
  /**
   * Number of frames for animating blocks disappearing.
   */
  private int animationFrames = 10;
  
  /**
   * The difficulty level of the game, which determines the
   * speed of the animation.
   */
  private PlayLevel level;
  
  /**
   * When the IGame object is in the COLLAPSING state, this 
   * field stores the the cells to be collapsed in the 
   * next step.  This value can be used to apply special rendering
   * or animation to the collapsing cells.  An invariant is maintained
   * that this variable is non-null if and only if the IGame state
   * is COLLAPSING.
   */
  private List<Position> blocksToCollapse = null;
  
  private boolean paused;
  
  /**
   * Constructs a GamePanel with the given game and play level.
   * @param pGame the IGame instance for which this is the UI
   * @param pPanel the score panel to be updated when the score changes
   * @param previewPanel the preview panel for the next piece
   * @param pLevel the IPlayLevel that will determine the 
   *   animation speed for this UI
   */
  public GamePanel(Game pGame, ScorePanel pPanel, PreviewPanel previewPanel, PlayLevel pLevel)
  {
    this.previewPanel = previewPanel;
    scorePanel = pPanel;
    game = pGame;
    level = pLevel;
    addKeyListener(new MyKeyListener());
    timer = new Timer(level.speed(0) , new TimerCallback());
    timer.start();
  }
  
  // The paintComponent is invoked by the Swing framework whenever
  // the panel needs to be rendered on the screen.  In this application,
  // repainting is normally triggered by the calls to the repaint() 
  // method in the timer callback and the keyboard event handler (see below).
  
  @Override
  public void paintComponent(Graphics g)
  {
    // clear background
    g.setColor(GameMain.BACKGROUND_COLOR);
    g.fillRect(0, 0, getWidth(), getHeight());

    // paint occupied cells of the grid
    for (int row = 0; row < game.getHeight(); ++row)
    {
      for (int col = 0; col < game.getWidth(); ++col)
      {
        Icon t = game.getIcon(row, col);
        if (t != null)
        { 
          paintOneCell(g, row, col, t);
        }
      }
    }
    
    if (blocksToCollapse != null)
    {
      // if cells are collapsing, flash them
      //if (animationState % 2 != 0)
      if (animationState > 0)
      {
        g.setColor(Color.DARK_GRAY);

        for (int i = 0; i < blocksToCollapse.size(); ++i)
        {
          Position p = blocksToCollapse.get(i);
          Icon t = game.getIcon(p.row(), p.col());
          paintOneCellDisappearing(g, p.row(), p.col(), t);
          //g.fillRect(p.col() * GameMain.SIZE, p.row() * GameMain.SIZE, GameMain.SIZE, GameMain.SIZE);
          
        }
      }
    }
    else if (!game.gameOver())
    {
      // otherwise, paint the current polyomino
      Piece t = game.getCurrent();
      for (Cell c : t.getCellsAbsolute())
      {
        Icon b = c.getIcon();
        g.setColor(b.getColorHint());
        paintOneCell(g, c.getRow(), c.getCol(), b);
      }

    }
  }
  
  /**
   * Renders a single cell of the grid.
   * 
   * @param g the Swing graphics context
   * @param row y-coordinate of the cell to render
   * @param col x-coordinate of the cell to render
   * @param t the IPolyomino associated with the cell, normally used
   *   to determine the color with which to render the cell
   */
  private void paintOneCell(Graphics g, int row, int col, Icon t)
  {
    // scale everything up by the SIZE
    int x = GameMain.SIZE * col;
    int y = GameMain.SIZE * row;
    g.setColor(t.getColorHint());
    g.fillRect(x, y, GameMain.SIZE, GameMain.SIZE);
    g.setColor(Color.GRAY);
    g.drawRect(x, y, GameMain.SIZE - 1, GameMain.SIZE - 1);
//    if (t.isMagic())
//    {
//      int offset = GameMain.SIZE / 5;
//      g.setColor(Color.WHITE);
//      g.fillOval(x + offset, y + offset, offset * 3, offset * 3);
//    }
  }
  
  private void paintOneCellDisappearing(Graphics g, int row, int col, Icon t)
  {
    // background
    int x = GameMain.SIZE * col;
    int y = GameMain.SIZE * row;
    g.setColor(GameMain.BACKGROUND_COLOR);  // background?
    g.fillRect(x, y, GameMain.SIZE, GameMain.SIZE);

    // draw the cell smaller depending on the flashing state
    double percent = ((double) animationState) / (animationFrames);
    int cellSize = (int) Math.round(percent * GameMain.SIZE);
    int offset = (GameMain.SIZE - cellSize) / 2;
    
    Color c = t == null ? Color.YELLOW : t.getColorHint();
    
    // scale everything up by the SIZE
    x = GameMain.SIZE * col;
    y = GameMain.SIZE * row;
    g.setColor(c);
    g.fillRect(x + offset, y + offset, cellSize, cellSize);
    //g.setColor(Color.GRAY);;
    //g.drawRect(x, y, GameMain.SIZE - 1, GameMain.SIZE - 1);
  }
  
  /**
   * Method invoked each time the timer fires.  
   */
  private void doOneStep()
  {
    // transition the game through one step, and interpret the status
    GameStatus state = game.step();
    
    if (state == GameStatus.GAME_OVER)
    {
      timer.stop();
    }
    else
    {
      if (state == GameStatus.NEW_SHAPE)
      {
        // if we were in the collapsing state, we're done
        blocksToCollapse = null;
        
        // TODO only do this if we were animating
        int speed = level.speed(game.getScore());
        timer.setDelay(speed);
        timer.setInitialDelay(speed);
        timer.restart();
      }
      if (state == GameStatus.COLLAPSING || state == GameStatus.STOPPED)
      {
        // current polygon has reached the bottom, so if we were doing
        // a fast drop, reset the timer to normal
        if (fastDrop)
        {
          normalSpeed();
          fastDrop = false;
        }
        if (state == GameStatus.COLLAPSING)
        {
          // indicates that next call to step() will collapse cells,
          // so we want to animate them before invoking step() again.
          // Use the fast drop rate for animation
          blocksToCollapse = game.getPositionsToCollapse();
          animationState = animationFrames;
          fastSpeed();
        }
      }
      // else state is FALLING, nothing to do but repaint
    }   
  }
  
  private void normalSpeed()
  {
    int speed = level.speed(game.getScore());
    timer.setDelay(speed);
    timer.setInitialDelay(speed);
    timer.restart();
  }
  
  private void fastSpeed()
  {
    int speed = level.fastDropSpeed(game.getScore());
    timer.setDelay(speed);
    timer.setInitialDelay(0);
    timer.restart();
  }
  
  /**
   * Listener for timer events.  The actionPerformed method
   * is invoked each time the timer fires.
   */
  private class TimerCallback implements ActionListener
  {
    @Override
    public void actionPerformed(ActionEvent arg0)
    {
      if (!paused)
      {
        if (animationState == 0)
        {
          doOneStep();
          scorePanel.updateScore(game.getScore());
          previewPanel.updatePiece(game.getPreview());
          repaint();
        }
        else
        {
          repaint();
          animationState--;
        }   
      }
      repaint();
    }
  }
  
  /**
   * Listener for keyboard events.
   */
  private class MyKeyListener implements KeyListener
  {
    @Override
    public void keyPressed(KeyEvent e)
    {
      int code = e.getKeyCode();
      if (code == KeyEvent.VK_RIGHT)
      {
        if (game.shiftRight())
        {
          repaint();
        }
      }
      else if (code == KeyEvent.VK_LEFT)
      {
        if (game.shiftLeft())
        {
          repaint();
        }
      }
      else if (code == KeyEvent.VK_UP)
      {
        if (game.transform())
        {
          repaint();
        }
      }
      else if (code == KeyEvent.VK_SPACE)
      {
        game.cycle();
        repaint();
      }
      else if (code == KeyEvent.VK_DOWN)
      {
        if (!fastDrop)
        {
          // reset timer for the fast drop frame rate
          fastSpeed();
          fastDrop = true;
        }
      }
      else if (code == KeyEvent.VK_P)
      {
        paused = !paused;
      }
    }

    @Override
    public void keyReleased(KeyEvent e)
    {
      int code = e.getKeyCode();
      if (code == KeyEvent.VK_DOWN)
      {
        // turn off fast drop mode when downarrow is released,
        // but not if we're animating
        if (fastDrop && animationState == 0)
        {
          normalSpeed();
        }
        if (fastDrop)
        {
          fastDrop = false;
        }
      }
    }

    @Override
    public void keyTyped(KeyEvent e)
    {
      // not used
    }
    
  }

}
