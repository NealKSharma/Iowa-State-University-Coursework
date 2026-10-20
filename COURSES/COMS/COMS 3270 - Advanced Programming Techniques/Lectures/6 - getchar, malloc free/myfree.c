#include <stdio.h>
#include <stdlib.h>

void myFree(float **arr){
    free(*arr);
    *arr = NULL;
}

int main(int argc, char argv[]){
    float *arr = malloc(sizeof(float) * 10);

    myFree(&arr);

    return 0;
}