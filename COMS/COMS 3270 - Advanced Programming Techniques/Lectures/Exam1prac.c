#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void swap(int *a, int *b){
    int temp = *b;
    *b = *a;
    *a = temp;
}

void freeplusplus(void **p){
    free(*p);
    *p = NULL;
}

char *strndup (const char *s, size_t n){
    size_t len;
    while(len < n && s[len] != "\0"){
        len++;
    }

    char *p = malloc(len + 1); // +1 for the terminator
    for(size_t i = 0; i < len; i++){ // or memcpy(p, s, len);
        p[i] = s[i];
    }
    p[len] = '\0';

    return p;
}

int main (int argc, char *argv[]){
    
    // printf("You're plastic!\n"); // Output - You're plastic!

    // char *a[] = {
    //     "happen \n", "to ", "make ", "stop ", "\"fetch\" ", "trying ",
    // };
    // int o[] = {3, 5, 1, 2, 4, 0};
    // for(int i = 0; i < 6; i++){
    //     printf("%s", a[o[i]]); // Output - Stop trying to make "fetch" happen
    // }

    // char s[] = "On Wednesdays we wear pink!"; 
    // *(s + 1) = 'O';
    // *(s + 2) = 'n';
    // *(s + 3) = ' ';
    // *(s + 4) = 'S';
    // *(s + 5) = 'a';
    // *(s + 6) = 't';
    // *(s + 7) = 'u';
    // *(s + 8) = 'r';
    // *(s + 26) = '.';
    // printf("%s", s + 1); // Output = On Saturays we wear pink.

    // char *n = "I just moved here from Africa.";
    // n[17] = '.';
    // n[18] = '\0';
    // printf("%s", n); // Runtime error

    // char *p, k[] = "!ocoC nnelG, og, uoY  !ocoC nnelg, uoy rof ruoF";
    // for(p = k + strlen(k); *p; p--){ // strlen ignores the null pointer so its still in bounds.
    //     putchar(*p); // 1st character is null pointer
    // } // Produces no output since loop stops as soon as it sees the null pointer

    // char *p, j[] = "?brac a rettub sI";
    // for(p = j + strlen(j) - 1; *p; p--){
    //     putchar(*p);
    // } // Runtime Error since loop continues on for infinity since there isnt a null pointer at the beginning of j

    // int a = 5, b = 7;
    // swap(&a, &b);
    // printf("A = %d, B = %d", a ,b);

    /*
    1) list_item_t *
    2) int32_t
    3) uint32_t *
    4) struct list_item
    5) list_item_t
    f) int
    g) int32_t (*)(const void *, vonst void *)
    h) void *
    i) list_t *
    j) char
    */

    return 0;
}