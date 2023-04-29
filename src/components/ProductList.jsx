import React, { useState, useEffect, useMemo} from 'react';
import { BrandsService, CategoriesService, ProductService, SortService } from '../Service';

const ProductList = () => {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("productName");
    const [sortOrder, setSortOrder] = useState("asc");
    const [originalProducts, setoriginalProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState("");

    useEffect(()=>{
        (async()=>{

            let brandsResponse = await BrandsService.fetchBrands();
            let brandsResponseBody = await brandsResponse.json();
            setBrands(brandsResponseBody);

            let categoriesResponse = await CategoriesService.fetchCategories();
            let categoriesResponseBody = await categoriesResponse.json();

            let productsResponse = await fetch(
                `http://localhost:5000/products?productName_like=${search}&_sort=productName&_order=ASC`,
                {method: "GET"}
            );
            let productsResponseBody = await productsResponse.json();

            productsResponseBody.forEach((product) => {
                product.brand = BrandsService.getBrandByBrandId(
                  brandsResponseBody,
                  product.brandId
                );
        
                product.category = CategoriesService.getCategoryByCategoryId(
                  categoriesResponseBody,
                  product.categoryId
                );
              });

              setProducts(productsResponseBody);
              setoriginalProducts(productsResponseBody);
        })();
    },[search])

    const onSortColumnNameClick = (e, columnName) => {
        e.preventDefault();
        setSortBy(columnName);
        const negatedSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(negatedSortOrder);
        setProducts(SortService.getSortArray(originalProducts, columnName, negatedSortOrder))
    }

    const filterProducts = useMemo(() => {
        return originalProducts.filter(
            (prod) => prod.brand.brandName.indexOf(selectedBrand) >= 0
        );
    },[originalProducts, selectedBrand])

    useEffect(()=> {
        setProducts(SortService.getSortArray(filterProducts, sortBy, sortOrder))
    }, [ filterProducts, sortBy, sortOrder ])

    const getColumnHeader = (columnName, DisplayName) => {
        return (
            <>
                <a 
                    href="/#"
                    onClick={(e)=>{
                        onSortColumnNameClick(e, columnName)
                    }}
                >{DisplayName}{" "}</a>
                    {sortBy === columnName && sortOrder === "asc" ? (
                        <i className="fa fa-sort-up"></i>) : ("")}
                    {sortBy === columnName && sortOrder === "desc" ? (
                        <i className="fa fa-sort-down"></i>) : ("")}
            </>
        )
    }

    return (
        <div className="row">
            <div className="col-12">
                <div className="row p-3 header">
                    <div className="col-lg-3">
                        <h4>
                            <i className="fa fa-suitcase"></i> Products{" "}
                            <span className="badge bg-secondary">{products.length}</span>
                        </h4>
                    </div>

                    <div className="col-lg-6">
                        <input 
                            type="search" 
                            value={search}
                            placeholder="Search"
                            className="form-control"
                            autoFocus="autofocus"
                            onChange={(e)=> {
                                setSearch(e.target.value);
                            }}
                        />
                    </div>
                    <div className="col-lg-3">
                    <select
                        className="form-control"
                        value={selectedBrand}
                        onChange={(event) => {
                            setSelectedBrand(event.target.value);
                        }}
                    >
                        <option value="">All Brands</option>
                            {brands.map((brand) => (
                        <option value={brand.brandName} key={brand.id}>
                            {brand.brandName}
                        </option>
                        ))}
                    </select>
          </div>
                </div>
            </div>
            <div className="col-lg-10 mx-auto mb-2">
                <div className="card my-2 shadow">
                    <div className="card-body">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>{getColumnHeader("productName", "Product Name")}</th>
                                    <th>{getColumnHeader("price", "Price")}</th>
                                    <th>{getColumnHeader("brand.brandName", "Brand")}</th>
                                    <th>{getColumnHeader("category.categoryName", "Category")}</th>
                                    <th>{getColumnHeader("rating", "Rating")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product)=>(
                                    <tr key={product.id}>
                                        <td>{product.productName}</td>
                                        <td>{product.price}</td>
                                        <td>{product.brand.brandName}</td>
                                        <td>{product.category.categoryName}</td>
                                        <td>
                                            {[...Array(product.rating).keys()].map((n)=>{
                                                return <i className="fa fa-star text-warning" key={n}></i>
                                            })}
                                            {[...Array(5-product.rating).keys()].map((n)=>{
                                                return <i className="fa fa-star-o text-warning" key={n}></i>
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductList;