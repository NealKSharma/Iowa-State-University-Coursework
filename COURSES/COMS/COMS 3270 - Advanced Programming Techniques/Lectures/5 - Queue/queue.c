#include <stdlib.h> // For NULL

#include "queue.h"

int queue_init(queue *q){
    q->head = q->tail = NULL;
    q->length = 0;

    return 0;
}

int queue_enqueue(queue *q, int payload){
    node *nn = malloc(sizeof(node));
    if(!nn) return 1;

    nn->data = payload;
    nn->next = NULL;
    
    if(!q->head){
        q->head = nn;
        q->tail = nn;
    } else {
        q->tail->next = nn;
        q->tail = nn;
    }

    q->length++;

    return 0;
}

int queue_dequeue(queue *q){
    if(!q->head) return 1;

    node *old = q->head;
    q->head = q->head->next;
    int ret = old->data;

    free(old);

    q->length--;
    if(q->length == 0) q->tail = NULL;

    return ret;
}

int queue_destroy(queue *q){
    while(!queue_isempty(q)) queue_dequeue(q);
    return 0;
}

int queue_length(queue *q){
    return q->length;
}

int queue_isempty(queue *q){
    return !q->head;
}