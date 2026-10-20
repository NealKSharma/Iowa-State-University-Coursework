#include <stdio.h>

#define DIM 10

void populate_table(int table[DIM][DIM]);

int main(int argc, char *argv[]){
    int i, j;

    int t[DIM][DIM];

    populate_table(t);

    for (i = 0; i < DIM; i++){
        for (j = 0; j < DIM; j++){
            printf("%5d", t[i][j]);
        }
        printf("\n");
    }
    
    return 0;
}

void populate_table(int table[DIM][DIM]){
    int i, j;
    for (i = 0; i < DIM; i++){
        for (j = 0; j < DIM; j++){
            table[i][j] = (i+1) * (j+1);
        }
    }
}