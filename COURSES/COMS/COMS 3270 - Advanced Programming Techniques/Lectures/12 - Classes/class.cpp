#include <iostream>

using namespace std;

class A {
    private:
    int x = 10; 

    public:
    A() : x(0) {cout << "A()" << endl;}
    ~A() {cout << "~A()" << endl;}
    virtual int incAndRet() {return ++x;}
};

class B : public A {
    private:
    int y = 11;

    public:
    B() : y(-100) {cout << "B()" << endl;}
    ~B() {cout << "~B()" << endl;}
    int incAndRet() {return ++y;}
};

int main(){
    cout << "Part 1:" << endl;
    A *ap = new A();

    cout << ap->incAndRet() << endl;

    delete ap;

    cout << "\nPart 2:" << endl;
    {
        B b;
        cout << b.incAndRet() << endl;
    }

    cout << "\nPart 3:" << endl;
    cout << "sizeof(A): " << sizeof(A) << endl;
    cout << "sizeof(B): " << sizeof(B) << endl;

    cout << "\nPart 4:" << endl;
    ap = new B(); // Will call the method in A since ap is a pointer to A
    cout << ap->incAndRet() << endl;
    delete ap;

    return 0;
}