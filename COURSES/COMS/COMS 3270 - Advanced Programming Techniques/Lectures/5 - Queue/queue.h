#ifndef QUEUE_H
#define QUEUE_H

typedef struct node node;
struct node{
    int data;
    node *prev;
    node *next;
};

typedef struct queue queue;
struct queue{
    node *head, *tail;
    int length;
};

int queue_init(queue *q);
int queue_enqueue(queue *q, int payload);
int queue_dequeue(queue *q);
int queue_length(queue *q);
int queue_isempty(queue *q);
int queue_destroy(queue *q);

#endif