#include <stdio.h>

int main (int argc, char *argv[]){
    int i;

    printf("Hello, World!\n");
    printf("Given %d arguments \n", argc);
    printf("argv[0]: %s\n", argv[0]);

    for(i = 0; i < argc; i++){
        printf("Hello %s\n", argv[i]);
    }

    return 0;
}