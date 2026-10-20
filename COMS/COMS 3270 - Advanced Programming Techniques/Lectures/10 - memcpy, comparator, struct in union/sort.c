#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void insertion_sort(void *a, int n, int s, int (*compare)(const void *lhs, const void *rhs))
{
    int i, j;

    void *t = malloc(s);

    // printf("sizeof(a)=%d\n", sizeof(a));
    printf("%d %d\n", n, s);

    for (i = 1; i < n; i++)
    {
        for (j = i - 1, memcpy(t, a + (i * s), s); j >= 0 && compare(a + (j * s), t) > 0; j--)
        {
            memcpy(a + ((j + 1) * s), a + (j * s), s);
        }
        memcpy(a + (j + 1) * s, t, s);
    }

    free(t);
}

void insertion_sort_int(int *a, int n)
{
    int i, j, t;

    for (i = 1; i < n; i++)
    {
        for (j = i - 1, t = a[i]; j >= 0 && a[j] > t; j--)
        {
            a[j + 1] = a[j];
        }
        a[j + 1] = t;
    }
}

int compare_ints_rev(const void *lhs, const void *rhs)
{
    return *(const int *)rhs - *(const int *)lhs;
}

int compare_chars(const void *lhs, const void *rhs)
{
    return *(const char *)lhs - *(const char *)rhs;
}

int main()
{
    int i;
    int a[] = {3, 7, 0, 1, 8, 9, 4, 6, 5, 2};
    char s[] = "Hello, world!";

    insertion_sort_int(a, 10);
    for (i = 0; i < 10; i++)
    {
        printf("%d ", a[i]);
    }
    printf("\n");

    insertion_sort(a, sizeof(a) / sizeof(a[0]), sizeof(a[0]), compare_ints_rev);
    for (i = 0; i < sizeof(a) / sizeof(a[0]); i++)
    {
        printf("%d ", a[i]);
    }
    printf("\n");

    insertion_sort(s, sizeof(s) / sizeof(s[0]), sizeof(s[0]), compare_chars);
    for (i = 0; i < sizeof(s) / sizeof(s[0]); i++)
    {
        printf("%c", s[i]);
    }
    printf("\n");

    return 0;
}