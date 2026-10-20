#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#include "queue.h"

#define TEST_SIZE 10

int main(int argc, char *argv[]){
    queue myqueue;

    queue_init(&myqueue);

    for(int i = 0; i < TEST_SIZE; i++){
        int r = rand();
        printf("Adding %d\n", r);
        queue_enqueue(&myqueue, r);
    }

    while(queue_length(&myqueue) > TEST_SIZE/2){
        printf("Removed %d\n", queue_dequeue(&myqueue));
    }

    queue_destroy(&myqueue);

    return 0;
}