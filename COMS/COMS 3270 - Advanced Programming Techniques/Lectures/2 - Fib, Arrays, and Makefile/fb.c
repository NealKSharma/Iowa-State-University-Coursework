#include <stdio.h>
#include <stdlib.h>

unsigned fib(unsigned);

int main(int argc, char *argv[]){
    printf("%d\n", fib(atoi(argv[1])));
    return 0;
}

unsigned int fib(unsigned int d){
    if(d < 2) 
        return d;
    else
        return fib(d-1) + fib(d-2);
}