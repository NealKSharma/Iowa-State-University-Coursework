#include <stdio.h>

size_t strlen3270(const char *s) {
    int i;

    for(i=0 ; s[i] ; i++) ;

    return i;
}

int strcmp3270(const char *s1, const char *s2) {
    int i;

    for(i=0 ; s1[i] && s2[i] && s1[i] == s2[i] ; i++) ;

    return s1[i] - s2[i];
}

int strcmp_idiomatic(const char *s1, const char *s2) {
    while(*s1 && *s1++ == *s2++) ;

    return *s1 - *s2;
}

char *strcpy3270(char *dest, const char *src) {
    int i;
    for (i=0; src[i]; i++) {
        dest[i] = src[i];
    }

    dest[i] = '\0';

    return dest;
}

int main(int argc, char *argv[]) {
    char c;
    printf("sizeof(c): %d\n", sizeof(c));
    c = 65;
    printf("c: %c\n", c);

    c = 'B';
    printf("c: %d\n", c);


    char str1[] = "hello 1";
    char str2[7] = "hello 2";
    const char *str3 = "hello 3!!";

    printf("str1(size=%d): %s\n",sizeof(str1), str1);

    printf("str2(size=%d): %s\n",sizeof(str2), str2);

    printf("str3(size=%d): %s\n",sizeof(str3), str3);

    str1[5] = '\0';
    //str1[5] = 0;

    printf("%s\n", str1);
    printf("%s\n", str1+ 6);

    printf("%d\n", str3[5]);
    //str3[5] = '\0';

    printf("strlen3270(%s)=%d\n", str1, strlen3270(str1));


    return 0;
}