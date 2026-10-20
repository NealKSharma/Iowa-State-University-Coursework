#ifndef STRING3270_H
#define STRING3270_H

#include <ostream>

class string3270 {
    private: 
     char *str; 
     int length; // Both will be private (Everything until the next modifier)

    public: 
     string3270();
     string3270(const char *);
     string3270(const string3270 &);
     ~string3270(); // Destructor for the constructor (Since there's no garbage collector)

     int length() const;
     char *c_str() const;

     // Operators: +, <, ==
     //<ret> operator<op>(<args>)
     bool operator<(const string3270 &rhs) const;
     bool operator<=(const string3270 &rhs) const;
     bool operator>(const string3270 &rhs) const;
     bool operator>=(const string3270 &rhs) const;
     bool operator==(const string3270 &rhs) const;
     bool operator!=(const string3270 &rhs) const;

     // string3270 c = (a + b)
     string3270 operator+(const string3270 &) const;
     // a += b
     string3270 &operator+=(const string3270 &);
     string3270 operator+(const char *) const;
     string3270 &operator=(const string3270 &);
     string3270 &operator=(const char *);
     // c[0] = 'T'
     char &operator[](const int i) const;

     // Substring
     // I/O Operations ?
};

std::ostream &operator<<(std::ostream &o, string3270 &s);

#endif