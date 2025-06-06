import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../features/Product/ProductSlice.js";
import SearchFilter from "../component/Common/SearchFilter.jsx";
import ProductCard from "../component/Common/PoductCard.jsx";

const ProductLists = () => {
    const dispatch = useDispatch();
    const { products, isLoading } = useSelector((state) => state.products);

    const categories = [...new Set(products.map(product => product.category))];
    const [filteredCategory, setFilteredCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("featured");

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    const handleSearch = (query) => {
        setSearchQuery(query.toLowerCase());
    };

    const handleFilter = (category) => {
        setFilteredCategory(category);
    };

    const handleClear = () => {
        setSearchQuery("");
        setFilteredCategory("All");
        setSortOption("featured");
    };

    const handleSort = (e) => {
        setSortOption(e.target.value);
    };

    // console.log(products)
    // Filter and sort products
    const filteredProducts = (products || [])
        .filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchQuery) ||
                product.description.toLowerCase().includes(searchQuery) ||
                product.category.toLowerCase().includes(searchQuery);
            const matchesCategory = filteredCategory === "All" || product.category === filteredCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortOption) {
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                case "rating":
                    return b.rating - a.rating;
                case "newest":
                    return b.isNew - a.isNew;
                default: // featured
                    return (b.isHot - a.isHot) || (b.rating - a.rating);
            }
        });


    return (
        <>
            <div className="relative w-full h-[350px] bg-cover bg-center flex items-center justify-center"
                 style={{backgroundImage: "url('/Product/productmain.jpg')"}}>
                <div className="">
                    <h1 className="text-4xl font-bold text-gray-900"></h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 ">

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Left Side - Search & Filter */}
                    <div className="lg:col-span-1">
                        <SearchFilter
                            onSearch={handleSearch}
                            onFilter={handleFilter}
                            options={categories}
                            onClear={handleClear}
                            placeholder="Search products..."
                            filterLabel="Categories"
                            optionType="category"
                        />
                    </div>

                    {/* Right Side - Product Cards */}
                    <div className="lg:col-span-3">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-sm text-gray-600">
                                Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                            </p>
                            <div className="flex items-center gap-2">
                                <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
                                <select
                                    id="sort"
                                    value={sortOption}
                                    onChange={handleSort}
                                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rating</option>
                                    <option value="newest">Newest</option>
                                </select>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        id={product._id}
                                        key={product._id}
                                        image={product.image}
                                        name={product.name}
                                        price={product.price}
                                        originalPrice={product.originalPrice}
                                        isHot={product.isHot}
                                        isNew={product.isNew}
                                        category={product.category}
                                        description={product.description}
                                        rating={product.rating}
                                        reviews={product.reviews}
                                        stock={product.stock}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <h3 className="text-xl font-medium text-gray-600 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-4">
                                    Try adjusting your search or filter criteria
                                </p>
                                <button onClick={handleClear} className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600">
                                    Reset filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductLists;
