import _ from "lodash";

export const OrdersService = {
    getPreviousOrders: (orders) => {
        return orders.filter((ord) => ord.isPaymentCompleted === true);
    }, 
    getCart: (orders) => {
        return orders.filter((ord) => ord.isPaymentCompleted === false)
    }
}

export const ProductService = {
    getProductByProductId: (products, productId) => {
        return products.find((prod) => prod.id === productId)
    },
    fetchProducts : () => {
        return fetch("http://localhost:5000/products",{
            method: "GET",
        });
    }
};

export const BrandsService = {
    fetchBrands: () => {
        return fetch("http://localhost:5000/brands",{
            method: "GET",
        });
    },
    getBrandByBrandId: (brands, brandId) => {
        return brands.find((brand) => (brand.id === brandId))
    }
};

export const CategoriesService = {
    fetchCategories: () => {
        return fetch("http://localhost:5000/categories",{
            method: "GET",
        });
    },
    getCategoryByCategoryId: (categories, categoryId) => {
        return categories.find((category) => (category.id === categoryId))
    }
};

export const SortService = {
    getSortArray : (elements, sortBy, sortOrder) => {
        if(!elements) return elements;

        // let array = [...elements];

        const sortedArray = _.orderBy(elements, [sortBy], [sortOrder])

        return sortedArray;
    }
}