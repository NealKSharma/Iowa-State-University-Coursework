#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(int argc, char *argv[]){
    srand(time(NULL));

    printf("%d\n", rand());
    printf("%d\n", rand());
    printf("%d\n", rand());

    printf("%d\n", rand() % 10);
    printf("%d\n", rand() % 10);
    printf("%d\n", rand() % 10);

    printf("%d\n", (rand() % 10) + 1);
    printf("%d\n", (rand() % 10) + 1);
    printf("%d\n", (rand() % 10) + 1);

    printf("%f\n", (double)rand() / RAND_MAX);
    printf("%f\n", (double)rand() / RAND_MAX);
    printf("%f\n", (double)rand() / RAND_MAX);

    return 0;
}