    import axios from 'axios';
    import React, { useState, useEffect } from 'react';
    import "./style.css";

    const Home = () => {
    const [menu, setMenu] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newDish, setNewDish] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newAvailability, setNewAvailability] = useState(false);

    const [newOrder, setNewOrder] = useState({
        customerName: '',
        dishIds: [],
    });


    useEffect(() => {
        fetchMenu();
        fetchOrders();
    }, []);

    const fetchMenu = async () => {
        try {
        const response = await fetch('https://foodhub-btuo.onrender.com/menu');
        const data = await response.json();
        setMenu(data);
        } catch (error) {
        console.error('Error fetching menu:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch('https://foodhub-btuo.onrender.com/review_orders');
            const data = await response.json();
            //console.log(data)
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const addDish = async () => {
        const dish = {
        //   dish_id:count,
        dish_name: newDish,
        price: +newPrice,
        availability: newAvailability,
        };

        try {
        const response = await fetch('https://foodhub-btuo.onrender.com/add_dish', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(dish),
        });

        if (response.ok) {
            console.log(response)
        // const data = await response.json();
            //setMenu([...menu, data.dish]);
            setNewDish('');
            setNewPrice('');
            setNewAvailability(false);
            fetchMenu()
        } else {
            console.error('Error adding dish:', response.status);
        }
        } catch (error) {
        console.error('Error adding dish:', error);
        }
    };

    const removeDish = async (id) => {
        try {
        const response = await fetch(`https://foodhub-btuo.onrender.com/remove_dish/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // setMenu(menu.filter((dish) => dish.id !== id));
            fetchMenu()
        } else {
            console.error('Error removing dish:', response.status);
        }
        } catch (error) {
        console.error('Error removing dish:', error);
        }
    };

    const updateAvailability = async (id, availability) => {
        try {
        const response = await fetch(`https://foodhub-btuo.onrender.com/update_availability/${id}`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ availability }),
        });

        if (response.ok) {
            fetchMenu()
            // setMenu(
            //     Object.values(menu)?.map((dish) => {
            //     if (dish.id === id) {
            //       return { ...dish, availability };
            //     }
            //     return dish;
            //   })
            // );
        } else {
            console.error('Error updating availability:', response.status);
        }
        } catch (error) {
        console.error('Error updating availability:', error);
        }
    };

    const orderStatuses = ['received', 'preparing', 'ready for pickup', 'delivered'];
    const updateOrderStatus = async (id, status) => {
        try {
        const response = await fetch(`https://foodhub-btuo.onrender.com/update_order_status/${id}`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (response.ok) {
            fetchOrders()
            // setMenu(
            //   menu.map((dish) => {
            //     if (dish.id === id) {
            //       return { ...dish, status };
            //     }
            //     return dish;
            //   })
            // );
        } else {
            console.error('Error updating order status:', response.status);
        }
        } catch (error) {
        console.error('Error updating order status:', error);
        }
    };

    const addOrder = async (e) => {
        e.preventDefault();

        try {
        const response = await axios.post('https://foodhub-btuo.onrender.com/new_order', {
            customer_name: newOrder.customerName,
            dish_ids: newOrder.dishIds,
            status: 'received',
        });
        const order = response.data;
        console.log(order)
        //setOrders((prevOrders) => [order]);
        setNewOrder({
            customerName: '',
            dishIds: [],
        });
        fetchOrders()
        } catch (error) {
        console.error('Error adding order:', error);
        }
    };

    const toggleDishSelection = (dishId) => {
        setNewOrder((prevOrder) => {
        const dishIds = prevOrder.dishIds.includes(dishId)
            ? prevOrder.dishIds.filter((id) => id !== dishId)
            : [...prevOrder.dishIds, dishId];
    
        return {
            ...prevOrder,
            dishIds,
        };
        });
    };

    return (
        <div className='container'>
        <h1 style={{fontSize:"40px"}}>FoodHub</h1>
        <h2>Add a New Dish</h2>
        <form>
            <label>
            Dish:
            <input placeholder='Enter Dish Name'
                type="text"
                value={newDish}
                onChange={(e) => setNewDish(e.target.value)}
            />
            </label>
            <label>
            Price:
            <input placeholder='Enter Price'
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
            />
            </label>
            <label>
            Availability:
            <input
                type="checkbox"
                checked={newAvailability}
                onChange={(e) => setNewAvailability(e.target.checked)}
            />
            </label>
            <button type="button" onClick={addDish}>
            Add Dish
            </button>
        </form>

        <h2>Menu</h2>
        <table>
            <thead>
            <tr>
                {/* <th>ID</th> */}
                <th>Name</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {Object.values(menu)?.map((dish) => (
                <tr key={dish.id}>
                {/* <td>{dish.dish_id}</td> */}
                <td>{dish.dish_name}</td>
                <td>{dish.price}</td>
                <td>{dish.availability ? 'Yes' : 'No'}</td>
                <td>
                    <button onClick={() => removeDish(dish.dish_id)}>Remove</button>
                    <button className='toggle-availability'
                    onClick={() =>
                        updateAvailability(dish.dish_id, !dish.availability)
                    }
                    >
                    Toggle Availability
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        {/* Add Order section */}
        <div className='ordersection'>

        
        <h2>Add New Order</h2>
        
        <form onSubmit={addOrder}>
            <input
            type="text"
            value={newOrder.customerName}
            onChange={(e) =>
                setNewOrder((prevOrder) => ({
                ...prevOrder,
                customerName: e.target.value,
                }))
            }
            placeholder="Enter customer name"
            required
            />
            <div>
            <div className='takeorder'>
            {Object.values(menu)?.map((dish) => (
                <label key={dish.dish_id}>
                <input
                    type="checkbox"
                    value={dish.dish_id}
                    checked={newOrder.dishIds.includes(dish.dish_id)}
                    onChange={() => toggleDishSelection(dish.dish_id)}
                    disabled={!dish.availability}
                />
                {dish.dish_name}
                </label>
            ))}
            </div>
            </div>
            <button type="submit">Add Order</button>
        </form>
        
        <h2>Orders</h2>
        <div >
        <div className='orderdetails'>
        {Object.values(orders)?.map((dish) => (
            
                
            <div className='box' key={dish.order_id}>
            <h3>Customer Name: {dish.customer_name}</h3>
            <div>
               <h3>Ordered Dishes:{' '}    </h3> 
               <p>
                {dish.dish_ids?.map((dishId) => {
                const dish = Object.values(menu).find((item) => item.dish_id === dishId);
                return dish ? dish.dish_name+"      " : '';
                })}</p>
            </div>
            <div><h3>Status:</h3> {dish.status}</div>
            <select
                value={dish.status}
                onChange={(e) => updateOrderStatus(dish.order_id, e.target.value)}
            >
                {orderStatuses.map((status) => (
                <option key={status} value={status}>
                    {status}
                </option>
                
                ))}
            </select>
            </div>
            
        ))}</div>
        </div>
        </div>
        </div>
    );
    };

    export default Home;
