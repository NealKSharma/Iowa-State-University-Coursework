package hw2;

/**
 * Models a tennis scoring system.
 * Manages scoring, sets games, and points for a tennis match.
 * Supports normal, tie-breaks, and grand slams games.
 *
 * @author Neal Kaushik Sharma
 */
public class Tennis {
/**
 * Instance variables to store things such as player names, scores, etc.
 */
	private String callout; 				// stores the current callout
    private String playerAName; 			// Name of player A
    private String playerBName;				// Name of player B

    private boolean isBestOfFive;			// Checks if the game is a best of five
    private boolean isPlayingTieBreaks; 	// Checks if tie-breaks are being played
    private boolean isGrandSlam;			// Checks if it's a Grand Slam
	private boolean matchOver;				// Checks if someone has won the match
    private boolean Deuce;					// Checks if it's a Deuce
	private boolean tieBreakerGame;    	 	// Indicates if a tie-break game is in progress
    private boolean tieBreakerTurn;			// Stores original server before tie-break
	private boolean playerAServing = true;  // Checks if Player A (if true) is serving or Player B (if false)
    private boolean waitTurn = true;		// Toggle for server during a tie-berak

    private int playerAGames = 0;     		// Stores the number of games won by player A
    private int playerASets = 0;      		// Stores the number of sets won by player A
    private int playerBGames = 0;           // Stores the number of games won by player B
    private int playerBSets = 0;      		// Stores the number of sets won by player B
    private int playerAScore = 0;     		// Stores the number of points won by player A
    private int playerBScore = 0;        	// Stores the number of points won by player B
    private int winDeuce = 0;         		// Stores the first advantage during a Deuce
	private int setsToWin = 0;   			// Stores the number of sets to win to win the whole match
	
	/**
     * Constructor to initialize a tennis match.
     * 
     * @param playerAName    		the name of Player A
     * @param playerBName    		the name of Player B
     * @param isBestOfFive   		whether the match is best of five sets
     * @param isPlayingTieBreaks 	whether tie-breaks are played
     * @param isGrandSlam    		whether the match is a Grand Slam
     */
    public Tennis(String playerAName, String playerBName, boolean isBestOfFive, boolean isPlayingTieBreaks, boolean isGrandSlam) {
        this.playerAName = playerAName;
        this.playerBName = playerBName;
        this.isBestOfFive = isBestOfFive;
        this.isPlayingTieBreaks = isPlayingTieBreaks;
        this.isGrandSlam = isGrandSlam;
		setsToWin = isBestOfFive ? 3 : 2; // 3 sets to win if it's a best of five otherwise 2
    }
    /**
     * @return the name of Player A
     */
    public String getPlayerAName() {
        return playerAName;
    }
    /**
     * @return the name of Player B
     */
    public String getPlayerBName() {
        return playerBName;
    }
    /**
     * Retrieves the score of Player A based on the game and tie-break state.
     * 
     * @return the current score of Player A in a string format
     */
    public String getPlayerAScore() {
        if (isPlayingTieBreaks && (playerAGames == 6 && playerBGames == 6)) return " " + playerAScore;

        if (winDeuce == 1) return "AD";
        if (winDeuce == 2) return "--";

        if (playerAScore == 0) return " 0";
        else if (playerAScore == 1) return "15";
        else if (playerAScore == 2) return "30";
        else if (playerAScore == 3) return "40";

        return playerAScore + "";
    }
    /**
     * @return true if Player A is serving, false otherwise
     */
	public boolean getPlayerAServing() {
        return playerAServing;
    }
	/**
     * @return the number of sets won by Player A
     */
    public int getPlayerASets() {
        return playerASets;
    }
    /**
     * @return the number of games won by Player A in the current set
     */
    public int getPlayerAGames() {
        return playerAGames;
    }
    /**
     * Retrieves the score of Player B based on the game and tie-break state.
     * 
     * @return the current score of Player B in a string format
     */
    public String getPlayerBScore() {
        if (isPlayingTieBreaks && (playerAGames == 6 && playerBGames == 6)) return " " + playerBScore;
        
        if (winDeuce == 2) return "AD";
        if (winDeuce == 1) return "--";
        
        if (playerBScore == 0) return " 0";
        else if (playerBScore == 1) return "15";
        else if (playerBScore == 2) return "30";
        else if (playerBScore == 3) return "40";

        return playerBScore + "";
    }
    /**
     * @return the number of sets won by Player B
     */
    public int getPlayerBSets() {
        return playerBSets;
    }
    /**
     * @return the number of games won by Player B in the current set
     */
    public int getPlayerBGames() {
        return playerBGames;
    }
    /**
     * @return the current callout of the match (score announcement)
     */
    public String getCallOut() {
        return callout;
    }
    /**
     * Updates the match when a player wins a point.
     * 
     * @param playerAWins true if Player A wins the point, false if Player B wins
     */
    public void winPoint(boolean playerAWins) {
        String aCall;
        String bCall;
        if (!matchOver) {

            if (playerAWins) playerAScore++;
            else playerBScore++;
            
            if (!tieBreakerGame) {
                if (playerAScore >= 4 && playerAScore - 2 >= playerBScore) winGame(true);
                else if (playerBScore >= 4 && playerBScore - 2 >= playerAScore) winGame(false);
                else {
                    if (playerAScore == playerBScore) {
                        if (playerAScore > 3) {
                            callout = "Deuce";
                            Deuce = true;
                        } else {
                            if (playerAScore == 0) aCall = "Love";
                            else if (playerAScore == 1) aCall = "Fifteen";
                            else if (playerAScore == 2) aCall = "Thirty";
                            else aCall = "Forty";
                                                       
							callout = aCall + "-All";
                        }

                    } else if (Deuce) {
                        if (playerAWins) {
                            winDeuce = 1;
                            callout = "Advantage " + playerAName;
                        } else {
                            winDeuce = 2;
                            callout = "Advantage " + playerBName;
                        }
                        Deuce = false;
                    } else {

                        if (playerAScore == 0) aCall = "Love";
                        else if (playerAScore == 1) aCall = "Fifteen";
                        else if (playerAScore == 2) aCall = "Thirty";
                        else aCall = "Forty";
                        
                        if (playerBScore == 0) bCall = "Love";
                        else if (playerBScore == 1) bCall = "Fifteen";
                        else if (playerBScore == 2) bCall = "Thirty";
                        else bCall = "Forty";
                        
                        if (playerAServing) callout = aCall + "-" + bCall;
                        else callout = bCall + "-" + aCall;
                    }
                }
            } else {
                if ((playerAScore >= 7 && !isGrandSlam && playerAScore - 2 >= playerBScore) || (playerAScore >= 10 && isGrandSlam && playerAScore - 2 >= playerBScore)) winGame(true);
                else if ((playerBScore >= 7 && !isGrandSlam && playerBScore - 2 >= playerAScore) || (playerBScore >= 10 && isGrandSlam && playerBScore - 2 >= playerAScore)) winGame(false);
                else {
                    if (playerAScore == playerBScore) callout = playerAScore + "-All";
                    else {
                        if (playerAScore > playerBScore) callout = playerAScore + "-" + playerBScore + " " + playerAName;
                        else callout = playerBScore + "-" + playerAScore + " " + playerBName;
                        }
                    }
                }
            }
            if (isPlayingTieBreaks && tieBreakerGame) {
                if (waitTurn) {
                    waitTurn = false;
                    playerAServing = !playerAServing;
                } else waitTurn = true;
            }
        }
    /**
     * Updates the match when a player wins a game.
     * 
     * @param playerAWins true if Player A wins the game, false if Player B wins
     */
    public void winGame(boolean playerAWins) {
        playerAScore = 0;
        playerBScore = 0;
        winDeuce = 0;
        if (!matchOver) {
            if (playerAWins) playerAGames++;
            else playerBGames++;
            
			if (playerAGames >= 6 && playerAGames - 2 >= playerBGames) winSet(true);
            else if (playerBGames >= 6 && playerBGames - 2 >= playerAGames) winSet(false);
            else if (tieBreakerGame) {
                playerAServing = tieBreakerTurn;
                tieBreakerGame = false;
                waitTurn = true;
                if (playerAGames == 7) winSet(true);
                else winSet(false);
                
            } else {
                if (isPlayingTieBreaks && playerAGames == 6 && playerBGames == 6) {
                    tieBreakerGame = true;
                    tieBreakerTurn = !playerAServing;
                }
                if (playerAWins) callout = "Game: " + playerAName;
                else callout = "Game: " + playerBName;
                
            }
            if(playerAServing) playerAServing = false;
			else playerAServing = true;
        }
    }
    /**
     * Updates the match when a player wins a set.
     * 
     * @param playerAWins true if Player A wins the set, false if Player B wins
     */
    public void winSet(boolean playerAWins) {
        playerAGames = 0;
        playerBGames = 0;
        if (!matchOver) {
            if (playerAWins) {
                playerASets++;
                if (playerASets == setsToWin) {
                    callout = "Game, Set and Match: " + playerAName; 
                    matchOver = true;
                } else {
                    callout = "Game and Set: " + playerAName;
                }
            } else {
                playerBSets++;
                if (playerBSets == setsToWin) {
                    callout = "Game, Set and Match: " + playerBName; 
                    matchOver = true;
                } else {
                    callout = "Game and Set: " + playerBName;
                }
            }
        }
    }
    /**
     * Prints out what the scoreboard must indicate.  It counts sets and games
     * in a natural way, with whole numbers.  However points within a game are
     * counted using the nonconsecutive numbers 0, 15, 30, 40.  When there is
     * a deuce, it is indicated as 40 for both players.  If one player has an
     * advantage, their score is represented as "AD", while the other player's
     * score is simultaneously indicated as "--".  When counting score in
     * tiebreak games, we simply use normal counting.
     */
    @Override
    public String toString() {
    String playerAServingIndicator;
    String playerBServingIndicator;
    if (getPlayerAServing()) {
        playerAServingIndicator = "S>";
        playerBServingIndicator = "  ";
    } else {
        playerAServingIndicator = "  ";
        playerBServingIndicator = "S>";
    }
    String returned =
        String.format(
                "%2s %-12s %2d %2d %6s\n%2s %-12s %2d %2d %6s\n",
    	playerAServingIndicator,
    	getPlayerAName(),
    	getPlayerASets(),
    	getPlayerAGames(),
    	getPlayerAScore(),
    	playerBServingIndicator,
    	getPlayerBName(),
    	getPlayerBSets(),
    	getPlayerBGames(),
    	getPlayerBScore());
    // System.out.println(returned);
    return returned;
    }
    /**
     * For testing purposes, converts a string of a's and b's into a sequence
     * of calls to winPoint, using an argument of true if the corresponding
     * character is an a, and false if the corresponding character is a b.
     * Provides a convenient way to run many winPoint method calls with
     * very concise notation.
     *
     * @param pointList - "script" that is converted into winPoint method
     * calls.
     */
    public void runPoints(String pointList) {
    for (int i = 0; i < pointList.length(); ++i) {
        if (pointList.charAt(i) == 'a') {
    	winPoint(true);
        } else if (pointList.charAt(i) == 'b') {
    	winPoint(false);
        } else {
    	// skip the character silently
        }
    }
    }
    /**
     * For testing purposes, converts a string of a's and b's into a sequence
     * of calls to winGame, using an argument of true if the corresponding
     * character is an a, and false if the corresponding character is a b.
     * Provides a convenient way to run many winGame method calls with
     * very concise notation.
     *
     * @param gameList - "script" that is converted into winGame method
     * calls.
     */
    public void runGames(String gameList) {
    for (int i = 0; i < gameList.length(); ++i) {
        if (gameList.charAt(i) == 'a') {
    	winGame(true);
        } else if (gameList.charAt(i) == 'b') {
    	winGame(false);
        } else {
    	// skip the character silently
        }
    }
    }
    /**
     * For testing purposes, converts a string of a's and b's into a sequence
     * of calls to winSet, using an argument of true if the corresponding
     * character is an a, and false if the corresponding character is a b.
     * Provides a convenient way to run many winSet method calls with
     * very concise notation.
     *
     * @param setList - "script" that is converted into winSet method calls.
     */
    public void runSets(String setList) {
    for (int i = 0; i < setList.length(); ++i) {
        if (setList.charAt(i) == 'a') {
    	winSet(true);
        } else if (setList.charAt(i) == 'b') {
    	winSet(false);
        } else {
    	// skip the character silently
        	}
    	}
    }
}
