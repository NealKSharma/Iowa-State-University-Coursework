#include <stdio.h>

int main(int argc, char *argv[]){
    char c;
    while((c = getchar()) != 'q'){
        printf("Got %c!\n", c);
    }
}