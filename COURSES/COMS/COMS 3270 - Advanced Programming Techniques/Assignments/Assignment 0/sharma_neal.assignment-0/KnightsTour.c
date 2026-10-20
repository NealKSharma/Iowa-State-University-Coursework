#include <stdio.h>

#define DIM 5

int board[DIM][DIM];
int path[DIM * DIM];
int totalTours = 0;

void populate_board();
void draw_board();
void tour(int x, int y, int step);

int main(int argc, char *argv[]){
    populate_board(); // Populates the board 1 to 25 when DIM is 5

    // Start from every square
    for (int i = 0; i < DIM; i++) {
        for (int j = 0; j < DIM; j++) {
            tour(i, j, 1);
        }
    }

    printf("\nBoard: \n");
    draw_board(); // Showcases the drawn board
    printf("\nTotal Tours: %d\n\n", totalTours);

    return 0;
}

void populate_board(){
    int num = 1;
    for (int i = 0; i < DIM; i++){
        for (int j = 0; j < DIM; j++){
            board[i][j] = num;
            num++;
        }
    }
}

void draw_board(){
    for (int i = 0; i < DIM; i++){
        for (int j = 0; j < DIM; j++){
            printf("%2d ", board[i][j]);
        }
        printf("\n");
    }
}

void tour(int x, int y, int step){
    // Store the current square number
    path[step - 1] = board[x][y];

    // If we have visited DIM * DIM squares, we have done a full tour
    if (step == DIM * DIM) {
        totalTours++;
        for (int i = 0; i < DIM * DIM; i++) {
            printf("%d", path[i]);
            if (i != (DIM * DIM) - 1) {
                printf(",");
            }
        }
        printf("\n");
        return;
    }

    // Sets the current square to -1 to indicate it visited
    int tempValue = board[x][y];
    board[x][y] = -1;

    // Handle Knight's movement
    if (x + 2 < DIM && y + 1 < DIM && board[x + 2][y + 1] != -1) { // Right 2, Up 1
        tour(x + 2, y + 1, step + 1);
    }
    if (x + 1 < DIM && y + 2 < DIM && board[x + 1][y + 2] != -1) { // Right 1, Up 2
        tour(x + 1, y + 2, step + 1);
    }
    if (x - 1 >= 0 && y + 2 < DIM && board[x - 1][y + 2] != -1) { // Left 1, Up 2
        tour(x - 1, y + 2, step + 1);
    }
    if (x - 2 >= 0 && y + 1 < DIM && board[x - 2][y + 1] != -1) { // Left 2, Up 1
        tour(x - 2, y + 1, step + 1);
    }
    if (x - 2 >= 0 && y - 1 >= 0 && board[x - 2][y - 1] != -1) { // Left 2, Down 1
        tour(x - 2, y - 1, step + 1);
    }
    if (x - 1 >= 0 && y - 2 >= 0 && board[x - 1][y - 2] != -1) { // Left 1, Down 2
        tour(x - 1, y - 2, step + 1);
    }
    if (x + 1 < DIM && y - 2 >= 0 && board[x + 1][y - 2] != -1) { // Right 1, Down 2
        tour(x + 1, y - 2, step + 1);
    }
    if (x + 2 < DIM && y - 1 >= 0 && board[x + 2][y - 1] != -1) { // Right 2, Down 1
        tour(x + 2, y - 1, step + 1);
    }

    // Backtrack for recursion
    board[x][y] = tempValue;
}