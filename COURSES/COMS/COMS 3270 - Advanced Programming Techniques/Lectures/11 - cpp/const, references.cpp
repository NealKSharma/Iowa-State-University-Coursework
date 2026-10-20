#include <iostream>

using namespace std;

int main(int argc, char *argv[]){
    // const volatile int i = 0;

    // *((int *)&i) = 1;

    // cout << i << endl;

    int a, b;

    int &r = a; // r is a reference to a; that is, r and a are aliases

    r = a; // a = a

    a = 0;
    b = 1;

    return 0;
}