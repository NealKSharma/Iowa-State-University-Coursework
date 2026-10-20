#include <iostream>

using namespace std;

class shape{
    virtual float perimeter() = 0;
    virtual float area() = 0;
};

class rect : shape {
    protected:
     float x, y;

    public:
     rect(float x, float y) : x(x), y(y) {};
     virtual float area() override { return x * y; }
     virtual float perimenter() override { return 2 * (x * y); }
};

class square : rect {
    square(float x) : rect(x, x) {};
};

class circle : shape {

};

int main() {
    return 0;
}