#include <vector>
#include <algorithm>
#include <iostream>

using namespace std;

void print_int(int i){ cout << i << endl; }
bool lessThan42(int i){ return i < 42; }

class useless {
    public:
     int operator()(int i) { return i * i; }
};

bool isPrime(unsigned i){
    if( i < 2) return false;
    for (int j = 2; j*j <= i; j++){
        if(i % j == 0){
            return false;
        }
    }
    return true;
}

int main(){
    vector<int> v;

    for (int i = 0; i < 100; i++){
        v.push_back(i);
    }

    for_each(v.begin(), v.end(), print_int);

    cout << count_if(v.begin(), v.end(), lessThan42) << endl;
    cout << count_if(v.begin(), v.end(), isPrime) << endl;
    cout << count_if(v.begin(), v.end(), [](int i) { return i % 2 == 0; }) << endl; // Lambda Function

    vector<int>::iterator it;
    if ((it = find_if(v.begin(), v.end(), [](int i) { return i == 5; })) != v.end()) { cout << "found" << *it << endl; } 

    // useless u;
    // for_each(v.begin(), v.end(), u);

    return 0;
}