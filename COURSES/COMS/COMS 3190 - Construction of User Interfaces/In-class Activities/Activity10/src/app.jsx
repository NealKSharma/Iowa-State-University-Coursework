//Author: Neal Kaushik Sharma
//Email : nea1@iastate.edu  
//Date : April 3, 2026
//Group: AH_17

import { useState } from "react";
import Products from "./components/products";
import SideNavbar from "./components/sidebar";
import { Categories } from "./data/categories";
import { Products as ProductData } from "./data/fashion";

const App = () => {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");

  const filteredProducts = ProductData.filter((p) => {
    const matchesCategory = active === "all" || p.category === active;
    const matchesSearch = p.title.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-screen">
      <SideNavbar categories={Categories} active={active} setActive={setActive} query={query} setQuery={setQuery} />
      <Products products={filteredProducts} />
    </div>
  );
};

export default App;