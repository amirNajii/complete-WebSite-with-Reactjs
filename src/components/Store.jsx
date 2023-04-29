import React, {useContext, useEffect, useState} from 'react';
import { UserContext } from '../UserContext';
import { BrandsService, CategoriesService, ProductService } from '../Service';

import Product from './Product';

const Store = () => {
    const userContext = useContext(UserContext);

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [productToShow, setProductsToShow] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        (async () => {

            let brandsResponse = await BrandsService.fetchBrands();
            let brandsResponseBody = await brandsResponse.json();
            brandsResponseBody.forEach((brand) => {
                brand.isChecked = true;
            })
            setBrands(brandsResponseBody);

            let categoriesResponse = await CategoriesService.fetchCategories();
            let categoriesResponseBody = await categoriesResponse.json();
            categoriesResponseBody.forEach((category) => {
                category.isChecked = true;
            })
            setCategories(categoriesResponseBody);

            let productsResponse = await fetch(
                `http://localhost:5000/products?productName_like=${search}`,
                {method: "GET"}
            );
            let productsResponseBody = await productsResponse.json();
            if(productsResponse.ok){
                productsResponseBody.forEach((product) => {
                    product.brand = BrandsService.getBrandByBrandId(brandsResponseBody, product.brandId);
                    product.category = CategoriesService.getCategoryByCategoryId(categoriesResponseBody, product.categoryId)
                    product.isOrdered = false;
                })
            }
            setProducts(productsResponseBody);
            setProductsToShow(productsResponseBody);
            document.title = "Store - Pista Academy"
        })();
    },[search]);

    const updateBrandIsChecked = (id) => {
        let brandsData = brands.map((brd) => {
            if(brd.id === id) brd.isChecked = !brd.isChecked;
            return brd;
        })
        setBrands(brandsData);
        updateProductsToShow();
    }
    const updateCategoryIsChecked = (id) => {
        let categoriesData = categories.map((ctg) => {
            if(ctg.id === id) ctg.isChecked = !ctg.isChecked;
            return ctg;
        })
        setCategories(categoriesData);
        updateProductsToShow();
    }

    let updateProductsToShow = () => {
        setProductsToShow(
          products
            .filter((prod) => {
              return (
                categories.filter(
                  (category) =>
                    category.id === prod.categoryId && category.isChecked
                ).length > 0
              );
            })
            .filter((prod) => {
              return (
                brands.filter(
                  (brand) => brand.id === prod.brandId && brand.isChecked
                ).length > 0
              );
            })
        );
      };

    const onAddToCartClick = (prod) => {
        (async ()=>{
            let newOrder = {
                userId: userContext.user.currentUserId,
                productId: prod.id,
                quantity: 1,
                isPaymentCompleted: false,
            };
            let orderResponse = await fetch(`http://localhost:5000/orders`,{
                method: "POST",
                body: JSON.stringify(newOrder),
                headers:{"Content-Type":"application/json"}
            });
            if(orderResponse.ok){
                let orderResponseBody = await orderResponse.json();
                let prods = products.map((p) => {
                    if(p.id === prod.id) p.isOrdered = true;
                    return p;
                });
                setProducts(prods);
                updateProductsToShow();
            } else {
                console.log(orderResponse);
            }
        })();
    };

    

    return (
        <div>
            <div className="row py-3 header">
                <div className="col-lg-3">
                    <h4>
                        <i className="fa fa-shopping-bag"></i>Store{" "}
                        <span className="badge bg-primary">
                            {productToShow.lenght}
                        </span>
                    </h4>
                </div>
                <div className="col-lg-9">
                    <input 
                        type="search"
                        value={search}
                        placeholder="Search Product"
                        className="form-control"
                        autoFocus="autofocus"
                        onChange={(e)=>{
                            setSearch(e.target.value)
                        }} 
                    />
                </div>
            </div>
            <div className="row">

                <div className="col-lg-3 py-2">
                    <div className="my-2">
                        <h5>Brands</h5>
                        <ul className="list-group list-group-flush">
                            {brands.map((brand)=>(
                                <li className="list-group-item" key={brand.id}>
                                    <div className="form-check">
                                        <input 
                                            type="checkbox" 
                                            className="form-check-input" 
                                            value="true"
                                            checked={brand.isChecked}
                                            id={`brand${brand.id}`}
                                            onChange={() => {
                                                updateBrandIsChecked(brand.id)
                                            }} 
                                        />
                                        <label 
                                            htmlFor={`brand${brand.id}`} 
                                            className="form-check-label">
                                            {brand.brandName}
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="my-2">
                        <h5>Categories</h5>
                        <ul className="list-group list-group-flush">
                            {categories.map((category)=>(
                                <li className="list-group-item" key={category.id}>
                                    <div className="form-check">
                                        <input 
                                            type="checkbox" 
                                            className="form-check-input" 
                                            value="true"
                                            checked={category.isChecked}
                                            id={`category${category.id}`}
                                            onChange={() => {
                                                updateCategoryIsChecked(category.id)
                                            }} 
                                        />
                                        <label 
                                            htmlFor={`category${category.id}`} 
                                            className="form-check-label">
                                            {category.categoryName}
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>


                </div>

                <div className="col-lg-9 py-2">
                    <div className="row">
                        {productToShow.map((prod)=> (
                            <Product key={prod.id} product={prod} onAddToCartClick={onAddToCartClick} />
                        ))}
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Store;