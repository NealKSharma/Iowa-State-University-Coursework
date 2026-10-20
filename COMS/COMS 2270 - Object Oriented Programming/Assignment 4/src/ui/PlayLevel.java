package ui;

/**
 * Timings for speeding up the game as the score increases.
 */
public class PlayLevel
{
  /**
   * Number of points to go to next "level".
   */
  private int[] scores = {50, 100, 300, 400};
  
  /**
   * Falling speed for each level.
   */
  private int[] speeds = {1000, 800, 700, 500, 2000};
  
  /**
   * Fast-drop speed for each level.
   */
  private int[] fastDropSpeeds = {80, 70, 60, 40, 20};
  
  public int fastDropSpeed(int score)
  {
    int i = 0;
    while (i < scores.length - 1 && score >= scores[i])
    {
      ++i;
    }
    // here score < scores[i]
    return fastDropSpeeds[i];
  }

  public int speed(int score)
  {
    int i = 0;
    while (i < scores.length - 1 && score >= scores[i])
    {
      ++i;
    }
    // score < scores[i]
    return speeds[i];
  }

}
