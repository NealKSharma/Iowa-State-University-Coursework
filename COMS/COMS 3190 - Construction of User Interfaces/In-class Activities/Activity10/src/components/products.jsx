//Author: Neal Kaushik Sharma
//Email : nea1@iastate.edu  
//Date : April 3, 2026
//Group: AH_17

import { useState } from "react";

const Products = ({ products }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      <div className="flex-1 p-8 bg-[#f8f8f8]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Products ({products.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              <div className="relative h-120 overflow-hidden group">
                <img
                  src={product.image}
                  alt="product"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <button
                    className="bg-white px-4 py-2 rounded text-sm font-medium"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowModal(true);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold">{product.title}</h3>
                <p className="text-green-600 font-bold">${product.price}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-amber-500 text-black">
                  {product.category}
                </span>
                <div className="text-yellow-400 text-sm">
                  {"★".repeat(Math.round(product.rating))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[500px] relative shadow-lg">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <div className="h-170 overflow-hidden rounded-lg">
              <img
                src={selectedProduct.image}
                alt="product"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-bold">{selectedProduct.title}</h2>
              <p className="text-sm text-gray-500 mt-2">
                {selectedProduct.description}
              </p>
              <span className=" mt-2 px-2 py-1 text-xs rounded-full bg-amber-500 text-black">
                {selectedProduct.category}
              </span>
              <p className="text-green-600 font-bold mt-3">${selectedProduct.price}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;