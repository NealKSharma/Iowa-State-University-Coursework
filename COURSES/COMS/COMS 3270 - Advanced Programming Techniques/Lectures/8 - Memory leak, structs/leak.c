#include <stdio.h>
#include <stdlib.h>

float func1(){
    float *p = malloc(sizeof(float));
    *p = 1.23;
    return *p;
}

int main(){
    float f;
    float *p;

    f = func1();
    printf("%f\n", f);

    return 0;
}