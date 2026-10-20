#include <stdio.h>

union demo {
    char arr[4];
    int a;
};

int main(){
    union demo demo;
    demo.arr[3] = '\0';
    demo.arr[0] = 'T';
    demo.arr[1] = 'h';
    demo.arr[2] = 'e';

    printf("%s\n", demo.arr);
    printf("%d\n", demo.a);

    demo.a = 0;
    printf("%s\n", demo.arr);

    return 0;
}