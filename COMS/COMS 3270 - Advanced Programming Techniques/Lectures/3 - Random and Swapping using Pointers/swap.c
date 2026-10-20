#include <stdio.h>

void swap (int *x, int *y){
    int temp = *x;
    *x = *y;
    *y = temp;
}

int main (int argc, char *argv[]){
    int a = 1, b = 2;

    printf("Before: %d, %d\n", a, b);
    swap(&a, &b);
    printf("After: %d, %d\n", a, b);

    return 0;
}