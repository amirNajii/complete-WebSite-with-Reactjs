import React, { useEffect, useContext, useState, useCallback } from 'react';
import { UserContext } from '../UserContext';
import Order from './Order';
import { OrdersService, ProductService } from './../Service';

const Dashboard = () => {

    const [orders, setOrders] = useState([]);
    const [showOrderDeleteAlert, setShowOrderDeleteAlert] = useState(false);
    const [showOrderPlacedAlert, setShowOrderPlacedAlert] = useState(false);


    const userContext = useContext(UserContext);

    // fetch data from orders array of database

    const loadDataFromDatabase = useCallback(async () => {
        let ordersResponse = await fetch(
            `http://localhost:5000/orders?userid=${userContext.user.currentUserId}`,
            {method: "GET"}
        );

        if(ordersResponse.ok){
            let ordersResponseBody = await ordersResponse.json();
            
            // get all data from products
            let productsResponse = await ProductService.fetchProducts();
            if(productsResponse.ok){
                let productsResponseBody = await productsResponse.json();
                
                ordersResponseBody.forEach((order) => {
                    order.product = ProductService.getProductByProductId(productsResponseBody, order.productId);
                });
            }
            
            setOrders(ordersResponseBody);
        }
    },[userContext.user.currentUserId]);

    useEffect(() => {
        document.title = 'Dashboard';
        loadDataFromDatabase();        
    },[userContext.user.currentUserId, loadDataFromDatabase]);

    const onBuyNowClick = useCallback(async (orderId, userId, productId, quantity) => {
        if(window.confirm("Do you want to place order for this product?")){
            let updateOrder = {
                id: orderId,
                userId: userId,
                productId: productId,
                quantity: quantity,
                isPaymentCompleted: true, 
            };
            let orderResponse = await fetch(
                `http://localhost:5000/orders/${orderId}`,{
                    method: "PUT",
                    body: JSON.stringify(updateOrder),
                    headers: {"Content-type":"application/json"},
                }
            );

            let orderResponseBody = await orderResponse.json();
            if(orderResponse.ok){
                loadDataFromDatabase();
                setShowOrderPlacedAlert(true);
            }
        }
    },[loadDataFromDatabase]);

    const onDeleteClick = useCallback(async (orderId) => {
        if(window.confirm("Are you sure to delete this item from cart?")){
            let orderResponse = await fetch(
                `http://localhost:5000/orders/${orderId}`,
                {
                    method: "DELETE",
                }
            );
            if(orderResponse.ok){
                let orderResponseBody = await orderResponse.json();
                loadDataFromDatabase();
                setShowOrderDeleteAlert(true);
            }
        }
    }, [loadDataFromDatabase])

    return (
        <div className="row">
            <div className="col-12 py-3 header">
                <h4>
                    <i className="fa fa-dashboard"></i> Dashboard{" "}
                    <button className="btn btn-sm btn-info" onClick={loadDataFromDatabase}>
                        <i className="fa fa-refresh"></i>Refresh
                    </button>
                </h4>
            </div>
            <div className="col-12">
                <div className="row">

                    <div className="col-lg-6">
                        <h4 className="py-2 my-2 text-info border-bottom border-info">
                            <i className="fa fa-history"></i> Previous Orders{" "}
                            <span className="badge bg-info">
                                {OrdersService.getPreviousOrders(orders).length}
                            </span>
                        </h4>
                        {OrdersService.getPreviousOrders(orders).length === 0 ? (
                            <div className="text-danger">No Orders</div>
                        ): ("")}
                        {OrdersService.getPreviousOrders(orders).map((ord)=> {
                            return <Order 
                                        key={ord.id} 
                                        productId={ord.productId}
                                        userId={ord.userId}
                                        isPaymentCompleted={ord.isPaymentCompleted}
                                        quantity={ord.quantity}
                                        orderId={ord.id}
                                        productName={ord.product.productName}
                                        price={ord.product.price}
                                        onBuyNowClick={onBuyNowClick}
                                        onDeleteClick={onDeleteClick}  
                                    />;
                        })}
                    </div>

                    <div className="col-lg-6">
                        <h4 className="py-2 my-2 text-primary border-bottom border-primary">
                            <div className="fa fa-shopping-cart"></div> cart{" "}
                            <span className="badge bg-primary">
                                {OrdersService.getCart(orders).length}
                            </span>
                        </h4>

                        {showOrderPlacedAlert ? (
              <div className="col-12">
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                  You Order has been placed.
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              </div>
            ) : (
              ""
            )}

            {showOrderDeleteAlert ? (
              <div className="col-12">
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                  Your item has been removed from the cart.
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              </div>
            ) : (
              ""
            )}


                        {OrdersService.getCart(orders).length === 0 ? (
                            <div className="text-danger">No products in your cart</div>
                        ): ("")}
                        {OrdersService.getCart(orders).map((ord)=> {
                            return (
                                <Order 
                                        key={ord.id} 
                                        productId={ord.productId}
                                        userId={ord.userId}
                                        isPaymentCompleted={ord.isPaymentCompleted}
                                        quantity={ord.quantity}
                                        orderId={ord.id}
                                        productName={ord.product.productName}
                                        price={ord.product.price}
                                        onBuyNowClick={onBuyNowClick}
                                        onDeleteClick={onDeleteClick} 
                                    />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;